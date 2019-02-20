namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Core.Context;
    using Core.Web;
    using Fanex.NAP.Core.Configuration;
    using Fanex.NAP.Core.Web.Context;
    using Fanex.NAP.Core.Web.Session;
    using Model.Enumerations;

    public class BaseController : Controller
    {
        private readonly string _environment = NapSettings.Settings == null ? string.Empty : NapSettings.Settings.Environment;
        private readonly int _siteId = NapSettings.Settings == null ? 0 : NapSettings.Settings.SiteId;
        private readonly bool _isSiteLogin = NapSettings.Settings == null ? false : NapSettings.Settings.EnableDirectLogin;

        public BaseController()
        {
            CurrentContext = new CurrentContext();

            if (NapSettings.Settings != null)
            {
                CurrentSession = new CurrentSession();
                ViewBag.Session = CurrentSession;
            }
        }

        public int SiteId
        {
            get { return _siteId; }
        }

        public bool IsSiteLogin
        {
            get { return _isSiteLogin; }
        }

        public string Environment
        {
            get { return _environment; }
        }

        public ICurrentContext CurrentContext
        {
            get;
            set;
        }

        public ICurrentSession CurrentSession
        {
            get;
            set;
        }

        public string GetLoginStatusError(NapLoginStatus loginStatus)
        {
            var error = string.Empty;
            switch (loginStatus)
            {
                case NapLoginStatus.InvalidUsernameOrPassword:
                    error = ViewResources.Invalid_Username_or_Password;
                    break;

                case NapLoginStatus.UserSuspended:
                    error = ViewResources.Your_account_was_suspended;
                    break;

                case NapLoginStatus.UserNoAuthorization:
                case NapLoginStatus.UserNoMenuPermission:
                    error = ViewResources.You_have_no_authorization;
                    break;

                default:
                    break;
            }

            return error;
        }

        protected string CheckEmptyParameter(string name, string value, string breakLine = "")
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return name + " is empty!" + breakLine;
            }

            return string.Empty;
        }

        protected string CheckInvalidRedmineId(int value, string breakLine = "")
        {
            if (value <= 0)
            {
                return "Redmine Id is invalid!" + breakLine;
            }

            return string.Empty;
        }
    }
}