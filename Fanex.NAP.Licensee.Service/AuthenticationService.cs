namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;
    using System.Web.Security;
    using Fanex.NAP.Core.Configuration;
    using Fanex.NAP.Core.Criteria.User;
    using Fanex.NAP.Core.Model;
    using Fanex.NAP.Core.Service.Impl;
    using Fanex.NAP.Core.Service.Interface;
    using Fanex.NAP.Core.Web;
    using Fanex.NAP.Core.Web.Auth;
    using Fanex.NAP.Core.Web.Context;
    using Fanex.NAP.Core.Web.Session;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.Enumerations;
    using Fanex.NAP.Licensee.Service.Utilities;

    /// <summary>
    /// AuthenticationService class.
    /// </summary>
    public class AuthenticationService : IAuthenticationService
    {
        private readonly ICurrentContext _napCurrentContext;
        private readonly IUserService _napUserService;
        private readonly ISiteService _napSiteService;
        private readonly IGroupService _napGroupService;
        private readonly IMenuItemService _napMenuItemService;
        private readonly IFunctionService _napFunctionService;
        private readonly ICurrentSession _currentSession;

        public AuthenticationService()
            : this(null, null, null, null, null, null, null)
        {
        }

        public AuthenticationService(
            ICurrentContext napCurrentContext = null,
            IUserService napUserService = null,
            ISiteService napSiteService = null,
            IGroupService napGroupService = null,
            IMenuItemService napMenuItemService = null,
            IFunctionService napFunctionService = null,
            ICurrentSession currentSession = null)
        {
            _napCurrentContext = napCurrentContext ?? new CurrentContext();
            _napUserService = napUserService ?? new UserService();
            _napSiteService = napSiteService ?? new SiteService();
            _napGroupService = napGroupService ?? new GroupService();
            _napMenuItemService = napMenuItemService ?? new MenuItemService();
            _napFunctionService = napFunctionService ?? new FunctionService();
            _currentSession = currentSession ?? new CurrentSession();
        }

        public NapLoginStatus ValidateUser(LoginUser loginUser)
        {
            var user = _napUserService.GetByUsername(loginUser.UserName) as User;
            if (user == null)
            {
                return NapLoginStatus.InvalidUsernameOrPassword;
            }

            string hashUserPassword = HashText(string.Format("{0}{1}", user.Password, loginUser.LoginToken), HashType.Sha256);

            if (!string.Equals(loginUser.Password, hashUserPassword, StringComparison.CurrentCulture))
            {
                return NapLoginStatus.InvalidUsernameOrPassword;
            }

            var site = _napSiteService.GetSiteLevelByUser(user.Id, loginUser.Enviroment)
                                    .FirstOrDefault(s => s.Site.Id == loginUser.NapSiteId && s.IsActive);
            if (site == null)
            {
                return NapLoginStatus.UserSuspended;
            }

            if (user.Group != null)
            {
                var group = _napGroupService.GetById(user.Group.Id);
                if (group != null && !group.IsActive)
                {
                    return NapLoginStatus.UserNoAuthorization;
                }
            }

            var menus = _napMenuItemService.GetByUserAndSiteIncludeGroup(user.Id, loginUser.NapSiteId, loginUser.Enviroment, true) as IList<MenuItem>;

            if (!menus.Any(m => m.Parent == null))
            {
                return NapLoginStatus.UserNoMenuPermission;
            }

            AssignSession(user, loginUser);
            
            return NapLoginStatus.LoginSuccessful;
        }

        public string GetLoginStatusError(NapLoginStatus loginStatus)
        {
            string error = string.Empty;
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

        /// <summary>
        /// Creates the authentication cookie.
        /// </summary>
        /// <returns>
        /// The authentication cookie.
        /// </returns>
        public HttpCookie CreateAuthenticationCookie(ICurrentSession currentSession)
        {
            string cookieName = FormsAuthentication.FormsCookieName;
            string cookiePath = _napCurrentContext.CurrentDomain.Path;
            string userData = (new AuthInfo
            {
                UserId = currentSession.UserId,
                OnUserId = currentSession.OnUserId,
            }).ToXml();

            var currentTime = DateTime.UtcNow;
            var formAuthentiationTicket = new FormsAuthenticationTicket(
                1,
                currentSession.Username,
                currentTime,
                currentTime.AddMinutes(20000),
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

        private string HashText(string plaintext, HashType hashType = HashType.Sha256)
        {
            if (string.IsNullOrWhiteSpace(plaintext))
            {
                return string.Empty;
            }

            byte[] textBuffer = Encoding.UTF8.GetBytes(plaintext);
            byte[] hashBuffer = GetHashAlgorithm(hashType).ComputeHash(textBuffer);
            string hash = BitConverter.ToString(hashBuffer);

            return hash.Replace("-", string.Empty).ToLower();
        }

        private HashAlgorithm GetHashAlgorithm(HashType hashType)
        {
            HashAlgorithm hashAlgorithm;
            switch (hashType)
            {
                case HashType.Sha1:
                    hashAlgorithm = new SHA1Managed();
                    break;

                case HashType.Sha256:
                    hashAlgorithm = new SHA256Managed();
                    break;

                case HashType.Sha512:
                    hashAlgorithm = new SHA512Managed();
                    break;

                case HashType.MD5:
                default:
                    hashAlgorithm = new MD5CryptoServiceProvider();
                    break;
            }

            return hashAlgorithm;
        }

        /// <summary>
        /// Assigns the session.
        /// </summary>
        /// <param name="user">The logged-in user.</param>
        /// <param name="menus">The menus.</param>
        /// <param name="sessionId">The session id.</param>
        private void AssignSession(User user, LoginUser loginUser)
        {
            int userId = user.Id;
            int siteId = NapSettings.Settings.SiteId;

            var criteria = new UserCheckInUserCriteria
            {
                UserId = userId,
                LoginDate = DateTime.UtcNow,
                NetSessionId = loginUser.SessionId,
                SiteId = siteId,
                Ip = _napCurrentContext.IP,
                BrowserName = _napCurrentContext.BrowserName,
                CountryCode = _napCurrentContext.CountryCode,
                Domain = _napCurrentContext.DomainName,
                Platform = _napCurrentContext.Platform
            };

            _napUserService.UserCheckIn(criteria);

            _currentSession.Level = _napUserService.GetUserSiteLevel(userId, siteId);
            _currentSession.UserId = userId;
            _currentSession.Username = user.Username;
            _currentSession.OnUserId = criteria.OnUserId;
            _currentSession.SessionId = loginUser.SessionId;

            CreateUserMenu(user, loginUser);

            var functions = _napFunctionService.GetByUserAndSiteIncludeGroup(userId, siteId, loginUser.Enviroment);
            AppSession.RoleAccess = PermissionService.GetRoleAccess(functions);
        }

        private void CreateUserMenu(User user, LoginUser loginUser)
        {
            _currentSession.MenuItemList = (IList<MenuItem>)_napMenuItemService.GetByUserAndSiteIncludeGroup(
                user.Id,
                loginUser.NapSiteId,
                loginUser.Enviroment,
                true);
        }
    }
}