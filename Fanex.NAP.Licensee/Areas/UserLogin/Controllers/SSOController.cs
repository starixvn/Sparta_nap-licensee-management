namespace Fanex.NAP.Licensee.Areas.UserLogin.Controllers
{
    using System;
    using System.CodeDom.Compiler;
    using System.Web.Mvc;
    using System.Web.Security;
    using Fanex.Logging;
    using Fanex.NAP.Core.Configuration;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Web.Session;
    using Fanex.NAP.Licensee.Controllers;
    using Fanex.NAP.Licensee.Service;
    using Model.DTO;
    using Model.Enumerations;
    using ONEbook.UM.Filters;

    [GeneratedCode("T4", "1.0.0.0")]
    [CheckUMFilter]
    public class SsoController : BaseController
    {
        private readonly ICurrentSession _currentSession;
        private readonly int _timeExipration = 30;
        private readonly IUserService _userService;
        private readonly ISSOAuthenticationService _ssoService;

        public SsoController()
            : this(null, null, null)
        {
        }

        public SsoController(
            ICurrentSession currentSession,
            IUserService userService,
            ISSOAuthenticationService ssoService)
        {
            _currentSession = currentSession ?? new CurrentSession();
            _userService = userService ?? new UserService();
            _ssoService = ssoService ?? new SSOAuthenticationService();
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult Index(SSOLogin ssoLogin)
        {
            ssoLogin.Environment = NapSettings.Settings.Environment;
            ssoLogin.SiteId = NapSettings.Settings.SiteId;
            ssoLogin.SessionId = Session.SessionID;

            var loginStatus = _ssoService.SingleSignOn(ssoLogin, _currentSession);

            if (loginStatus != NapLoginStatus.LoginSuccessful)
            {
                return Redirect(FormsAuthentication.LoginUrl);
            }
            
            return Redirect(ssoLogin.RedirectUrl);
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult AccountingLogin(SSOLogin ssoLogin)
        {
            try
            {
                Session.Clear();

                ssoLogin.Environment = NapSettings.Settings.Environment;
                ssoLogin.SiteId = NapSettings.Settings.SiteId;
                ssoLogin.SessionId = Session.SessionID;

                var loginStatus = _ssoService.SingleSignOn(ssoLogin, _currentSession);

                if (loginStatus != NapLoginStatus.LoginSuccessful)
                {
                    return Redirect(FormsAuthentication.LoginUrl);
                }

                AppSession.IsAccountingLogin = true;

                return Redirect(ssoLogin.RedirectUrl);
            }
            catch (Exception exception)
            {
                LogService.Error(exception.Message, exception);
                return Redirect(FormsAuthentication.LoginUrl);
            }
        }
    }
}