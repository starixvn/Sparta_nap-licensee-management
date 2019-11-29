namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Linq;
    using System.Web;
    using Model.DTO;
    using Model.DataDomain;
    using NAP.Core.Context;
    using NAP.Core.Models;
    using NAP.Core.Models.ParameterObject;
    using NAP.Core.Service.Impl;
    using NAP.Core.Service.Interface;
    using NAP.Core.Web.Context;
    using NAP.Core.Web.Session;

    public class LocalAuthenticationService : ILocalAuthenticationService
    {
        private const string LoginTokenName = "__SecureFormToken";

        private readonly IUserService _userService;
        private readonly ISecurityService _securityService;
        private readonly IGroupService _groupService;
        private readonly ICurrentContext _currentContext;

        public LocalAuthenticationService()
            : this(null, null, null, null)
        {
        }

        public LocalAuthenticationService(
            IUserService userService, 
            ISecurityService securityService,
            IGroupService groupService,
            ICurrentContext currentContext)
        {
            _userService = userService ?? new UserService();
            _securityService = securityService ?? new SecurityService();
            _groupService = groupService ?? new GroupService();
            _currentContext = currentContext ?? new CurrentContext();
        }

        public NapLoginStatus Login(LoginUser loginUser, ICurrentSession napCurrentSession)
        {
            var user = _userService.Get(loginUser.UserName);
            var validatedStatus = ValidateUser(user, loginUser);

            if (validatedStatus != NapLoginStatus.ValidatedSuccess)
            {
                return validatedStatus;
            }

            return ProcessLogin(user, loginUser, napCurrentSession);
        }

        private static void ClearToken()
        {
            var cookies = HttpContext.Current.Request.Cookies;
            if (cookies[LoginTokenName] != null)
            {
                var tokenCookie = new HttpCookie(LoginTokenName)
                {
                    Expires = DateTime.Now.AddDays(-1)
                };

                HttpContext.Current.Response.Cookies.Add(tokenCookie);
            }

            HttpContext.Current.Session.Remove(LoginTokenName);
        }

        private static bool ValidatePassword(User user, LoginUser loginUser)
        {
            var hashUserPassword = SecurityHelper.HashText(string.Format("{0}{1}", user.Password, loginUser.LoginToken), HashType.Sha256);

            return string.Equals(loginUser.Password, hashUserPassword, StringComparison.CurrentCulture);
        }

        private NapLoginStatus ValidateUser(User user, LoginUser loginUser)
        {
            if (user == null)
            {
                return NapLoginStatus.InvalidUsernameOrPassword;
            }

            if (!ValidatePassword(user, loginUser))
            {
                return NapLoginStatus.InvalidUsernameOrPassword;
            }

            if (!IsExistNapSite(user, loginUser))
            {
                return NapLoginStatus.UserSuspended;
            }

            if (!IsExistNapGroup(user))
            {
                return NapLoginStatus.UserNoAuthorization;
            }

            if (!IsExistMenuItems(user, loginUser))
            {
                return NapLoginStatus.UserNoMenuPermission;
            }

            return NapLoginStatus.ValidatedSuccess;
        }

        private bool IsExistNapSite(User user, LoginUser loginUser)
        {
            return _userService
                .GetSiteLevel(user.Id, loginUser.Environment)
                .FirstOrDefault(s => s.Site.Id == loginUser.SiteId && s.IsActive) != null;
        }

        private bool IsExistNapGroup(User user)
        {
            if (user.Group != null)
            {
                var group = _groupService.Get(user.Group.Id);

                if (group != null && !group.IsActive)
                {
                    return false;
                }
            }

            return true;
        }

        private bool IsExistMenuItems(User user, LoginUser loginUser)
        {
            return _userService.GetMenuItem(user.Id, loginUser.SiteId, loginUser.Environment, true).Any(m => m.Parent == null);
        }

        private NapLoginStatus ProcessLogin(User user, LoginUser loginUser, ICurrentSession napCurrentSession)
        {
            var onuserid = ProcessNapLogin(user, loginUser);

            if (onuserid <= 0)
            {
                return NapLoginStatus.InvalidUsernameOrPassword;
            }

            var menus = _userService.GetMenuItem(user.Id, loginUser.SiteId, loginUser.Environment, true).ToList();
            var userLevel = _userService.GetUserLevel(user.Id, loginUser.SiteId);

            ClearToken();

            AuthencationHelper.AssignAuthenticationCookie(_currentContext.CurrentDomain.Path, user, onuserid);
            AuthencationHelper.AssignCurrentSession(napCurrentSession, user, menus, userLevel, onuserid, loginUser.SessionId);
            AuthencationHelper.AssignAppSession(user, menus);

            return NapLoginStatus.LoginSuccessful;
        }

        private int ProcessNapLogin(User user, LoginUser loginUser)
        {
            return _securityService.Login(
                new LoginParameter
                {
                    UserId = user.Id,
                    LoginDate = DateTime.Now,
                    NetSessionId = loginUser.SessionId,
                    SiteId = loginUser.SiteId,
                    Ip = _currentContext.IP,
                    BrowserName = _currentContext.BrowserName,
                    CountryCode = _currentContext.CountryCode,
                    Domain = _currentContext.DomainName,
                    Platform = _currentContext.Platform
                });
        }
    }
}
