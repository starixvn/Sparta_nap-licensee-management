namespace Fanex.NAP.Licensee.AppStart
{
    using System.Web;
    using System.Web.Security;
    using NAP.Core.Criteria.User;
    using NAP.Core.Service.Impl;
    using NAP.Core.Web.Auth;
    using NAP.Core.Web.Session;

    /// <summary>
    /// Authentication class.
    /// </summary>
    public static class AuthConfig
    {
        /// <summary>
        /// Authenticate Request function.
        /// </summary>
        /// <param name="context">Http context.</param>
        public static void RegisterAuth(HttpContext context)
        {
            var user = HttpContext.Current.User;

            if (user != null)
            {
                if (user.Identity is FormsIdentity && user.Identity.IsAuthenticated)
                {
                    var cookie = FormsAuthentication.FormsCookieName;
                    var httpCookie = context.Request.Cookies[cookie];

                    if (httpCookie == null)
                    {
                        return;
                    }

                    FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(httpCookie.Value);
                    if (ticket == null || ticket.Expired)
                    {
                        return;
                    }

                    var identity = new FormsIdentity(ticket);
                    if (string.IsNullOrEmpty(ticket.UserData))
                    {
                        return;
                    }

                    var udata = AuthInfo.CreateUserData(ticket.UserData);
                    var principal = new NapPrincipal(identity, udata);
                    context.User = principal;
                }
            }
        }

        public static void SignOut()
        {
            var currentSession = new CurrentSession();
            var userService = new UserService();
            var logOutUserCriteria = new LogOutUserCriteria { OnUserId = currentSession.OnUserId };

            userService.UserLogOut(logOutUserCriteria);
            currentSession.ClearAll();
        }
    }
}