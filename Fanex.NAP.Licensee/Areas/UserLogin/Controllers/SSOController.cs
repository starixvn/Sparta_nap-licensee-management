// ----------------------------------------------------------------------
// <copyright file="SSOController.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ------------------------------------------------------------------------
// <history>
//   <change who="Jeff.Nguyen" date="2013/08/30">Created</change>
//   <change who="" date=""></change>
// </history>

namespace Fanex.NAP.Licensee.Areas.UserLogin.Controllers
{
    using System;
    using System.CodeDom.Compiler;
    using System.Collections.Generic;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Security;
    using Fanex.Common;
    using Fanex.Logging;
    using Fanex.NAP.Core.Configuration;
    using Fanex.NAP.Core.Criteria.User;
    using Fanex.NAP.Core.Domain;
    using Fanex.NAP.Core.Model;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Web.Auth;
    using Fanex.NAP.Core.Web.Session;
    using Fanex.NAP.Licensee.Controllers;
    using Fanex.NAP.Licensee.Service;
    using Fanex.NAP.Licensee.Service.Utilities;
    using ONEbook.UM.Filters;

    /// <summary>
    /// SSO Controller.
    /// </summary>
    [GeneratedCodeAttribute("T4", "1.0.0.0")]
    [CheckUMFilter]
    public class SsoController : BaseController
    {
        #region members

        private readonly ICurrentSession _currentSession;
        private readonly IFunctionService _functionService;
        private readonly IMenuItemService _menuItemService;
        private readonly int _timeExipration = 30;
        private readonly IUserService _userService;

        #endregion members

        #region ctors

        public SsoController()
            : this(null, null, null, null)
        {
        }

        public SsoController(
            IUserService userService,
            IMenuItemService menuItemService,
            ICurrentSession currentSession,
            IFunctionService functionService)
        {
            _userService = userService ?? new UserService();
            _menuItemService = menuItemService ?? new MenuItemService();
            _currentSession = currentSession ?? new CurrentSession();
            _functionService = functionService ?? new FunctionService();
        }

        #endregion ctors

        /// <summary>
        /// SSO login.
        /// </summary>
        /// <param name="userId">User id value.</param>
        /// <param name="onuserId">On user id value.</param>
        /// <param name="time">Time value.</param>
        /// <param name="redirectUrl">The url redirection.</param>
        /// <returns>Redirect page.</returns>
        [AllowAnonymous]
        [HttpGet]
        public ActionResult Index(string userId, string onuserId, string time, Uri redirectUrl = null)
        {
            userId = Cryptography.CfsDeCrypt(userId.Replace(" ", "+"));
            onuserId = Cryptography.CfsDeCrypt(onuserId.Replace(" ", "+"));
            time = Cryptography.CfsDeCrypt(time.Replace(" ", "+"));
            var currentTime = _userService.UserSSOGetTime();

            var expiration = Convert.ToDateTime(currentTime) - Convert.ToDateTime(time);

            if (expiration.TotalSeconds <= _timeExipration)
            {
                var criteria = SetUserCriteria(Convert.ToInt32(userId), Convert.ToInt32(onuserId));
                _userService.UserSSOCheckIn(criteria);

                if (criteria.OnUserId != 0)
                {
                    var user = _userService.GetById(criteria.UserId) as User;

                    _currentSession.UserId = user.Id;
                    _currentSession.Username = user.Username;
                    _currentSession.OnUserId = criteria.OnUserId;
                    _currentSession.SessionId = Session.SessionID;
                    _currentSession.Level = _userService.GetUserSiteLevel(user.Id, SiteId);

                    var currentFunction = _functionService.GetByUserAndSiteIncludeGroup(
                        user.Id, NapSettings.Settings.SiteId, NapSettings.Settings.Environment);
                    AppSession.CurrentUser = user;
                    AppSession.RoleAccess = PermissionService.GetRoleAccess(currentFunction);

                    if (SiteId != 0)
                    {
                        _currentSession.MenuItemList = _menuItemService.GetByUserAndSiteIncludeGroup(
                            user.Id,
                            SiteId,
                            Environment,
                            true) as IList<MenuItem>;
                        AppSession.CurrentUserMenu = _currentSession.MenuItemList;
                    }

                    CreateAuthInfo(user);

                    string forwardLink = redirectUrl == null ? FormsAuthentication.DefaultUrl : redirectUrl.ToString();

                    return Redirect(forwardLink);
                }
            }

            return Redirect(FormsAuthentication.LoginUrl);
        }

        /// <summary>
        /// Accounting login.
        /// </summary>
        /// <param name="username">User name value.</param>
        /// <param name="onuserId">On user id.</param>
        /// <param name="redirectUrl">Redirect url.</param>
        /// <returns>Redirect page.</returns>
        [AllowAnonymous]
        [HttpGet]
        public ActionResult AccountingLogin(string username, string onuserId, string redirectUrl)
        {
            try
            {
                Session.Clear();
                username = Cryptography.CfsDeCrypt(username.Replace(" ", "+"));
                onuserId = Cryptography.CfsDeCrypt(onuserId.Replace(" ", "+"));

                var user = _userService.GetByUsername(username) as User;

                if (user != null)
                {
                    var criteria = new UserCheckInUserCriteria
                    {
                        UserId = user.Id,
                        SiteId = SiteId,
                        NetSessionId = Session.SessionID,
                        Ip = CurrentContext.IP,
                        LoginDate = DateTime.Now,
                        BrowserName = CurrentContext.BrowserName,
                        CountryCode = CurrentContext.CountryCode,
                        Domain = CurrentContext.DomainName,
                        Platform = CurrentContext.Platform
                    };

                    _userService.UserCheckIn(criteria);

                    _currentSession.UserId = user.Id;
                    _currentSession.Username = user.Username;
                    _currentSession.OnUserId = criteria.OnUserId;
                    _currentSession.SessionId = Session.SessionID;
                    _currentSession.Level = _userService.GetUserSiteLevel(user.Id, SiteId);

                    var currentFunction = _functionService.GetByUserAndSiteIncludeGroup(
                        user.Id, NapSettings.Settings.SiteId, NapSettings.Settings.Environment);
                    AppSession.CurrentUser = user;
                    AppSession.RoleAccess = PermissionService.GetRoleAccess(currentFunction);
                    AppSession.IsAccountingLogin = true;

                    CreateAuthInfo(user);
                    return Redirect(redirectUrl);
                }

                return Redirect(FormsAuthentication.LoginUrl);
            }
            catch (Exception exception)
            {
                LogService.Error(exception.Message, exception);
                return Redirect(FormsAuthentication.LoginUrl);
            }
        }

        #region utilities

        /// <summary>
        ///     Set new value to user criteria.
        /// </summary>
        /// <param name="userId">User id parameter.</param>
        /// <param name="onuserId">On User id.</param>
        /// <returns>Return UserCriteria.</returns>
        private UserSSOCheckInUserCriteria SetUserCriteria(int userId, int onuserId)
        {
            return new UserSSOCheckInUserCriteria
            {
                UserId = userId,
                SiteId = SiteId,
                CheckOnUserId = onuserId,
                OnUserId = 0,
                IP = CurrentContext.IP,
                NetSessionId = Session.SessionID,
                LoginDate = DateTime.Now,
                BrowserName = CurrentContext.BrowserName,
                CountryCode = CurrentContext.CountryCode,
                Domain = CurrentContext.DomainName,
                Platform = CurrentContext.Platform
            };
        }

        /// <summary>
        /// Save user info to cookies.
        /// </summary>
        /// <param name="user">User info.</param>
        private void CreateAuthInfo(IUser user)
        {
            var currentDomain = CurrentContext.CurrentDomain;

            var authInfo = new AuthInfo();

            authInfo.UserId = user.Id;
            authInfo.OnUserId = _currentSession.OnUserId;

            var authTicket = new FormsAuthenticationTicket(
                1,
                user.Username,
                DateTime.Now,
                DateTime.Now.AddMinutes(20000),
                false,
                authInfo.ToXml(),
                currentDomain.Path);

            var encrypted = FormsAuthentication.Encrypt(authTicket);
            var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encrypted)
            {
                HttpOnly = true,
                Path = currentDomain.Path,
                Name = FormsAuthentication.FormsCookieName
            };

            Response.Cookies.Add(authCookie);
        }

        #endregion utilities
    }
}