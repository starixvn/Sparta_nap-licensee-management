namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Web;
    using System.Web.Security;
    using NAP.Core.Models;
    using NAP.Core.Web.Auth;
    using NAP.Core.Web.Session;

    public static class AuthencationHelper
    {
        public static void AssignAuthenticationCookie(string cookiePath, User user, int onuserid)
        {
            HttpContext.Current.Response.Cookies.Add(CreateAuthenticationCookie(cookiePath, user, onuserid));
        }

        public static void AssignCurrentSession(
            ICurrentSession currentSession,
            User user,
            IList<MenuItem> menuItems, 
            int userLevel, 
            int onuserid, 
            string sessionId)
        {
            currentSession.Level = userLevel;
            currentSession.UserId = user.Id;
            currentSession.Username = user.Username;
            currentSession.OnUserId = onuserid;
            currentSession.SessionId = sessionId;
            currentSession.MenuItemList = menuItems;
        }

        public static void AssignAppSession(User user, IList<MenuItem> menuItems)
        {
            AppSession.CurrentUserMenu = menuItems;
            AppSession.CurrentUser = user;
        }

        private static HttpCookie CreateAuthenticationCookie(string cookiePath, User user, int onuserid)
        {
            string cookieName = FormsAuthentication.FormsCookieName;

            string userData = (new AuthInfo
            {
                UserId = user.Id,
                OnUserId = onuserid,
            }).ToXml();

            var currentTime = DateTime.Now;
            var formAuthentiationTicket = new FormsAuthenticationTicket(
                1,
                user.Username,
                currentTime,
                currentTime.AddMinutes(FormsAuthentication.Timeout.Minutes),
                false,
                userData,
                cookiePath);

            string encryptTicket = FormsAuthentication.Encrypt(formAuthentiationTicket);

            return new HttpCookie(cookieName, encryptTicket)
            {
                Path = cookiePath,
                Name = cookieName,
                HttpOnly = true
            };
        }
    }
}
