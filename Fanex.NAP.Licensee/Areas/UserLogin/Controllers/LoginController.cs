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
    using System.Configuration;
    using System.Diagnostics.CodeAnalysis;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Security;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Licensee.Controllers;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.Enumerations;
    using Fanex.NAP.Licensee.Service;
    using Logging;
    using NAP.Core.Configuration;
    using NAP.Core.Criteria.User;
    using NAP.Core.Service.Impl;
    using NAP.Core.Service.Interface;
    using NAP.Core.Web.Session;
    using ONEbook.UM.Filters;

    /// <summary>
    /// Login controller.
    /// </summary>
    public class LoginController : BaseController
    {
        #region members

        private const string LoginTokenName = "__SecureFormToken";

        private readonly ICurrentSession _currentSession;
        private readonly IMaintenanceService _maintenanceService;
        private readonly ISiteService _siteService;
        private readonly IUserService _userService;
        private readonly IAuthenticationService _authenticationService;

        #endregion members

        public LoginController()
            : this(null, null, null, null, null)
        {
        }

        public LoginController(
            IUserService userService,
            ISiteService siteService,
            ICurrentSession currentSession,
            IMaintenanceService maintenanceService,
            IAuthenticationService authenticationService)
        {
            _userService = userService ?? new UserService();
            _siteService = siteService ?? new SiteService();
            _currentSession = currentSession ?? new CurrentSession();
            _maintenanceService = maintenanceService ?? new MaintenanceService();
            _authenticationService = authenticationService ?? new AuthenticationService();
        }

        private static string LoginTokenSession
        {
            get
            {
                return SessionManager.Get<string>(LoginTokenName);
            }

            set
            {
                SessionManager.Set(LoginTokenName, value);
            }
        }

        #region sign in

        /// <summary>
        /// Login action.
        /// </summary>
        /// <returns>Return result.</returns>
        [HttpGet]
        [UMBackdoorFilter]
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

            SetLoginTokenToCookieSession(CreateToken());

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
        [CheckUMFilter]
        public ActionResult Index(string username, string password, string loginToken)
        {
            Response.BufferOutput = true;

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                return LoginError("Invalid input!");
            }

            if (!ValidateLoginToken(loginToken))
            {
                return LoginError(ViewResources.Your_account_was_suspended);
            }

            NapLoginStatus loginStatus = _authenticationService.ValidateUser(new LoginUser
            {
                UserName = username,
                Password = password,
                Enviroment = Environment,
                LoginToken = loginToken,
                NapSiteId = NapSettings.Settings.SiteId,
                SessionId = Session.SessionID
            });

            if (loginStatus != NapLoginStatus.LoginSuccessful)
            {
                return LoginError(_authenticationService.GetLoginStatusError(loginStatus));
            }

            ClearLoginTokenFromCookieSession();

            Response.Cookies.Add(_authenticationService.CreateAuthenticationCookie(_currentSession));

            return Redirect(FormsAuthentication.DefaultUrl);
        }

        #endregion sign in

        #region sign out

        [CheckUMFilter]
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
        [CheckUMFilter]
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

        private bool ValidateLoginToken(string loginToken)
        {
            return !string.IsNullOrWhiteSpace(loginToken)
                && LoginTokenSession == loginToken
                && Request.Cookies[LoginTokenName] != null
                && Request.Cookies[LoginTokenName].Value == loginToken;
        }

        private ActionResult LoginError(string errorMessage)
        {
            SetLoginTokenToCookieSession(CreateToken());

            ViewBag.ErrorMessage = errorMessage;

            return View("~/Areas/UserLogin/Views/Login/Index.cshtml");
        }

        private void ClearLoginTokenFromCookieSession()
        {
            // Set Cookie is expired.
            var cookies = Request.Cookies;
            if (cookies[LoginTokenName] != null)
            {
                var tokenCookie = new HttpCookie(LoginTokenName);
                tokenCookie.Expires = DateTime.UtcNow.AddDays(-1);
                cookies.Add(tokenCookie);
            }

            // Remove from Session.
            Session.Remove(LoginTokenName);
        }

        private void SetLoginTokenToCookieSession(string loginToken)
        {
            ViewBag.LoginToken = loginToken;

            // Create the non-persistent secure form token cookie.
            var responseCookie = new HttpCookie(LoginTokenName)
            {
                HttpOnly = true,
                Value = loginToken
            };

            // If we are using SSL, the cookie should be set to secure to
            // prevent it from being sent over HTTP connections.
            if (FormsAuthentication.RequireSSL && Request.IsSecureConnection)
            {
                responseCookie.Secure = true;
            }

            // Add the cookie to the response.
            Response.Cookies.Set(responseCookie);

            // Add to Session.
            LoginTokenSession = loginToken;
        }

        private string CreateToken()
        {
            return Guid.NewGuid().ToString("N");
        }

        #endregion helpers
    }
}