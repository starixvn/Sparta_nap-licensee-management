namespace Fanex.NAP.Licensee.Areas.UserLogin.Controllers
{
    using System;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Security;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Licensee.Controllers;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.Enumerations;
    using Fanex.NAP.Licensee.Service;
    using NAP.Core.Configuration;
    using NAP.Core.Service.Impl;
    using NAP.Core.Service.Interface;
    using NAP.Core.Web.Session;
    using ONEbook.UM.Filters;
    using ONEbook.UM.Services;

    public class LoginController : BaseController
    {
        #region members

        private const string LoginTokenName = "__SecureFormToken";

        private readonly ICurrentSession _currentSession;
        private readonly IMaintenanceService _maintenanceService;
        private readonly ISiteService _siteService;
        private readonly IUserService _userService;
        private readonly ILocalAuthenticationService _localService;
        private readonly ICommonAuthenticationService _authenticationService;

        #endregion members

        public LoginController()
            : this(null, null, null, null, null, null)
        {
        }

        public LoginController(
            IUserService userService,
            ISiteService siteService,
            ICurrentSession currentSession,
            IMaintenanceService maintenanceService,
            ILocalAuthenticationService localService,
            ICommonAuthenticationService authenticationService)
        {
            _userService = userService ?? new UserService();
            _siteService = siteService ?? new SiteService();
            _currentSession = currentSession ?? new CurrentSession();
            _maintenanceService = maintenanceService ?? new ONEbook.UM.Services.Impl.MaintenanceService();

            _localService = localService ?? new LocalAuthenticationService();
            _authenticationService = authenticationService ?? new CommonAuthenticationService();
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

        [HttpGet]
        [CheckUMFilter]
        public ActionResult Index()
        {
            if (!NapSettings.Settings.IsNapHub && !IsSiteLogin)
            {
                // if login-directly feature is disabled then redirect users to NAP Hub
                return Redirect(NapSettings.Settings.HubUrl);
            }
            
            SetLoginTokenToCookieSession(CreateToken());

            return View();
        }

        [HttpPost]
        [CheckUMFilter]
        public ActionResult Index(LoginUser loginUser)
        {
            if (string.IsNullOrWhiteSpace(loginUser.UserName) || string.IsNullOrWhiteSpace(loginUser.Password))
            {
                return LoginError("Invalid input!");
            }

            if (!ValidateLoginToken(loginUser.LoginToken))
            {
                return LoginError(ViewResources.Your_account_was_suspended);
            }

            loginUser.Environment = NapSettings.Settings.Environment;
            loginUser.SiteId = NapSettings.Settings.SiteId;
            loginUser.SessionId = Session.SessionID;

            var loginStatus = _localService.Login(loginUser, _currentSession);

            if (loginStatus != NapLoginStatus.LoginSuccessful)
            {
                return LoginError(GetLoginStatusError(loginStatus));
            }

            return Redirect(FormsAuthentication.DefaultUrl);
        }

        [CheckUMFilter]
        public ActionResult LogOut()
        {
            _authenticationService.Logout(_currentSession);

            return Redirect(FormsAuthentication.LoginUrl);
        }

        [CheckUMFilter]
        public ActionResult ReCheckLogin()
        {
            var recheckInStatus = _authenticationService.RecheckIn(_currentSession);

            return Json(new { IsKickedOut = recheckInStatus });
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
    }
}