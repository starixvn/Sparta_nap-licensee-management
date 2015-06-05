// --------------------------------------------------------------------------
// <copyright file="LoginController.cs" company="Nexcel Solutions Vietnam">
// Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------
// <history>
//   <change who="Ricky.Nguyen" date="2012.12.12">Created</change>
//   <change who="Kaden.Trinh" date="2013.08.30">Check StyleCop</change>
// </history>

namespace Fanex.NAP.Licensee.Areas.UserLogin.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Security;
    using Common;
    using Fanex.NAP.Licensee.Controllers;
    using Fanex.NAP.Licensee.Service;
    using Fanex.NAP.Licensee.Service.Utilities;
    using Logging;
    using NAP.Core.Configuration;
    using NAP.Core.Criteria.User;
    using NAP.Core.Domain;
    using NAP.Core.Model;
    using NAP.Core.Model.ValueObject;
    using NAP.Core.Service.Impl;
    using NAP.Core.Service.Interface;
    using NAP.Core.Web;
    using NAP.Core.Web.Auth;
    using NAP.Core.Web.Session;

    /// <summary>
    /// Login controller.
    /// </summary>
    public class LoginController : BaseController
    {
        #region members

        private readonly ICurrentSession _currentSession;
        private readonly IFunctionService _functionService;
        private readonly IGroupService _groupService;
        private readonly IMaintenanceService _maintenanceService;
        private readonly IMenuItemService _menuItemService;
        private readonly ISiteService _siteService;
        private readonly IUserService _userService;

        #endregion members

        #region ctors

        public LoginController()
            : this(null, null, null, null, null, null, null)
        {
        }

        public LoginController(
            IUserService userService,
            IGroupService groupService,
            ISiteService siteService,
            IMenuItemService menuItemService,
            ICurrentSession currentSession,
            IFunctionService functionService,
            IMaintenanceService maintenanceService)
        {
            _userService = userService ?? new UserService();
            _groupService = groupService ?? new GroupService();
            _siteService = siteService ?? new SiteService();
            _menuItemService = menuItemService ?? new MenuItemService();
            _currentSession = currentSession ?? new CurrentSession();
            _functionService = functionService ?? new FunctionService();
            _maintenanceService = maintenanceService ?? new MaintenanceService();
        }

        #endregion ctors

        #region sign in

        /// <summary>
        /// Login action.
        /// </summary>
        /// <returns>Return result.</returns>
        [HttpGet]
       
        public ActionResult Index()
        {
            if (!NapSettings.Settings.IsNapHub && !IsSiteLogin)
            {
                // if login-directly feature is disabled then redirect users to NAP Hub
                return Redirect(NapSettings.Settings.HubUrl);
            }

            if (_maintenanceService.GetDowntimeInfo().IsDowntime)
            {
                return RedirectToAction("Offline", "Common");
            }

            return View();
        }

        /// <summary>
        /// Login function.
        /// </summary>
        /// <param name="username">User name value.</param>
        /// <param name="password">Password value.</param>
        /// <returns>Return result.</returns>
        [HttpPost]
        [SuppressMessage(
            "StyleCop.CSharp.Nexcel.NexcelCustomRules",
            "SP2101:MethodMustNotContainMoreLinesThan",
            Justification = "Reviewed. Suppression is OK here.")]
    
        public ActionResult Index(string username, string password)
        {
            Response.BufferOutput = true;
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                var user = _userService.GetByUsername(username.Trim()) as User;
                try
                {
                    if (user != null)
                    {
                        password = Cryptography.CfsEnCode(password);

                        if (password == user.Password)
                        {
                            var group = user.Group == null ? null : _groupService.GetById(user.Group.Id);

                            // gets all sites of logging-in user
                            var siteLevelList = _siteService.GetSiteLevelByUser(user.Id, Environment);

                            if ((group == null || group.IsActive) &&
                                siteLevelList.Where(x => x.IsActive).Any())
                            {
                                // Check-in user
                                var criteria = SetUserCheckInCriteria(user.Id);
                                _userService.UserCheckIn(criteria);

                                // Saves user session
                                SaveUserSession(user, username, criteria.OnUserId);

                                var currentFunction =
                                    _functionService.GetByUserAndSiteIncludeGroup(user.Id, NapSettings.Settings.SiteId, NapSettings.Settings.Environment);
                                AppSession.CurrentUser = user;
                                AppSession.RoleAccess = PermissionService.GetRoleAccess(currentFunction);

                                if (AppSession.CurrentUserMenu != null &&
                                    AppSession.CurrentUserMenu.Where(m => m.Parent == null).ToList().Count > 0)
                                {
                                    // if the user login directly, not through NAP Hub
                                    if (IsSiteLogin)
                                    {
                                        if (UserIsActiveOnThisSite(siteLevelList))
                                        {
                                            return Redirect(FormsAuthentication.DefaultUrl);
                                        }

                                        DoSignOut();
                                        ViewBag.Message = ViewResources.Your_account_was_suspended;
                                    }
                                    else
                                    {
                                        return RedirectToRouteResult(siteLevelList);
                                    }
                                }
                                else
                                {
                                    // user has no menu permission
                                    DoSignOut();
                                    ViewBag.Message = ViewResources.You_have_no_authorization;
                                }
                            }
                            else
                            {
                                // user account was suspended on all sites
                                if (siteLevelList.Count() > 0)
                                {
                                    ViewBag.Message = ViewResources.Your_account_was_suspended;
                                }
                                else
                                {
                                    // logging-in user belongs to no site
                                    ViewBag.Message = ViewResources.You_have_no_authorization;
                                }
                            }
                        }
                        else
                        {
                            // wrong password
                            ViewBag.Message = ViewResources.Invalid_Username_or_Password;
                        }
                    }
                    else
                    {
                        // user doesn't exist
                        ViewBag.Message = ViewResources.Invalid_Username_or_Password;
                    }
                }
                catch (Exception exception)
                {
                    LogService.Error(exception.Message, exception);
                    throw;
                }
            }
            else
            {
                ViewBag.Message = "Invalid input!";
            }

            return View();
        }

        #endregion sign in

        #region sign out

        public ActionResult LogOut()
        {
            DoSignOut();

            return Redirect(FormsAuthentication.LoginUrl);
        }

        #endregion sign out

        #region re check in

        /// <summary>
        /// Re-check in.
        /// </summary>
        /// <returns>Return JSON value.</returns>
        public ActionResult ReCheckLogin()
        {
            try
            {
                if (!ConfigurationManager.AppSettings["IsLocalTest"].Equals("1"))
                {
                    var maintenanceInfo = _maintenanceService.GetDowntimeInfo();

                    if (maintenanceInfo.IsDowntime)
                    {
                        return Json(new
                        {
                            IsKickedOut = "3"
                        });
                    }

                    var siteStatus = _siteService.GetStatusById(SiteId);

                    if (!siteStatus)
                    {
                        return Json(new
                        {
                            IsKickedOut = "2"
                        });
                    }

                    var criteria = new UserReCheckInUserCriteria();
                    criteria.OnUserId = Convert.ToInt32(_currentSession.OnUserId);
                    _userService.ReUserCheckIn(criteria);

                    return Json(new
                    {
                        OnUserId = Convert.ToInt32(_currentSession.OnUserId),
                        IsKickedOut = criteria.IsKickedOut ? "1" : "0"
                    });
                }

                return Json(new
                {
                    IsKickedOut = "0"
                });
            }
            catch (Exception exception)
            {
                LogService.Error(exception.Message, exception);
                throw;
            }
        }

        #endregion re check in

        #region helpers

        private void DoSignOut()
        {
            _userService.UserLogOut(new LogOutUserCriteria
            {
                OnUserId = _currentSession.OnUserId
            });
            FormsAuthentication.SignOut();
            _currentSession.ClearAll();
        }

        private void CreateUserMenu(User user)
        {
            _currentSession.MenuItemList = (IList<MenuItem>)_menuItemService.GetByUserAndSiteIncludeGroup(
                user.Id,
                SiteId,
                Environment,
                true);
            AppSession.CurrentUserMenu = _currentSession.MenuItemList;
        }

        /// <summary>
        /// Save cookie user info.
        /// </summary>
        /// <param name="user">User info.</param>
        private void CreateAuthInfo(IUser user)
        {
            var currentDomain = CurrentContext.CurrentDomain;
            var authInfo = new AuthInfo { UserId = user.Id, OnUserId = _currentSession.OnUserId };
            var authTicket = new FormsAuthenticationTicket(
                1,
                user.Username,
                DateTime.Now,
                DateTime.Now.AddMinutes(20000),
                false,
                authInfo.ToXml(),
                currentDomain.Path);

            var encryptedTicket = FormsAuthentication.Encrypt(authTicket);
            var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket)
            {
                HttpOnly = true,
                Path = currentDomain.Path,
                Name = FormsAuthentication.FormsCookieName
            };

            Response.Cookies.Add(authCookie);
        }

        /// <summary>
        ///     Set new value to user criteria.
        /// </summary>
        /// <param name="userId">User id parameter.</param>
        /// <returns>Return user criteria.</returns>
        private UserCheckInUserCriteria SetUserCheckInCriteria(int userId)
        {
            return new UserCheckInUserCriteria
            {
                UserId = userId,
                SiteId = SiteId,
                NetSessionId = Session.SessionID,
                Ip = CurrentContext.IP,
                LoginDate = DateTime.Now,
                BrowserName = CurrentContext.BrowserName,
                CountryCode = CurrentContext.CountryCode,
                Domain = CurrentContext.DomainName,
                Platform = CurrentContext.Platform
            };
        }

        /// <summary>
        ///     Save user session.
        /// </summary>
        /// <param name="user">User parameter.</param>
        /// <param name="userName">User name.</param>
        /// <param name="userId">On user id.</param>
        private void SaveUserSession(User user, string userName, int userId)
        {
            _currentSession.Level = _userService.GetUserSiteLevel(user.Id, SiteId);
            _currentSession.UserId = user.Id;
            _currentSession.Username = userName;
            _currentSession.OnUserId = userId;
            _currentSession.SessionId = Session.SessionID;

            // current site is not NAP Hub
            if (SiteId != 0)
            {
                CreateUserMenu(user);
            }

            CreateAuthInfo(user);
        }

        /// <summary>
        ///     Checks if logging-in user is active on this site.
        /// </summary>
        /// <param name="siteLevelList">Site level.</param>
        /// <returns>Return boolean.</returns>
        private bool UserIsActiveOnThisSite(IEnumerable<SiteLevel> siteLevelList)
        {
            bool userIsActiveOnThisSite = false;

            foreach (var siteLevel in siteLevelList)
            {
                if (siteLevel.Site.Id == SiteId && siteLevel.IsActive)
                {
                    userIsActiveOnThisSite = true;
                }
            }

            return userIsActiveOnThisSite;
        }

        /// <summary>
        ///     Redirect To Route result.
        /// </summary>
        /// <param name="siteLevelList">Site level.</param>
        /// <returns>Return route result.</returns>
        private RedirectToRouteResult RedirectToRouteResult(IEnumerable<SiteLevel> siteLevelList)
        {
            // user has access to multiple sites
            if (siteLevelList.Where(s => s.IsActive).Count() > 1)
            {
                return RedirectToAction("Site", "UserSite");
            }

            var site = siteLevelList.Where(s => s.IsActive).First().Site;

            var listSiteUrl = _siteService.GetSiteUrlBySiteId(site.Id, Environment).Where(u => u.IsActive).ToList();

            // user has acces to one site
            if (listSiteUrl.Count() > 1)
            {
                return RedirectToAction("Site", "UserSite");
            }

            return RedirectToAction("Forward", "UserSite", new { id = listSiteUrl.First().SiteUrlId });
        }

        #endregion helpers
    }
}