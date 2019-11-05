namespace Fanex.NAP.Licensee.Service
{
    using System.Configuration;
    using System.Text;
    using Core;
    using Model.Criteria.LAPUser;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.Enumerations;

    public class LAPUserManagementService : ILAPUserManagementService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private static readonly ILogWriterService _logWriter = new LogWriterService();

        public LAPUserManagementService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public ResultData<string> AddUser(LAPUserCriteria criteria)
        {
            var result = new ResultData<string>();
            var parameter = new
            {
                criteria.UserID,
                criteria.SiteName,
                criteria.UserPWD,
                UserName = criteria.UserID,
                Email = criteria.Email ?? string.Empty,
                isEnabled = 1,
                isAdmin = 1
            };

            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_Insert"))
            {
                result.IsSuccess = (int)db.ExecuteScalar(parameter) == 1;
            }

            WriteAddUserActionLog(criteria);

            return result;
        }

        public ResultData<string> UpdateUserPassword(LAPUserCriteria criteria, bool isBackgroundJob = false)
        {
            var result = new ResultData<string>();

            var userInfo = GetUserInfo(criteria.SiteName, criteria.UserID);
            var parameter = new
            {
                userInfo.UserSEQ,
                criteria.UserPWD
            };

            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_UpdatePW"))
            {
                result.IsSuccess = (int)db.ExecuteScalar(parameter) == 1;
            }

            WriteUpdateUserPWActionLog(criteria, isBackgroundJob);

            return result;
        }

        public UserInfo GetUserInfo(string siteName, string userID)
        {
            var parameter = new
            {
                UserID = userID,
                SiteName = siteName
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_Select"))
            {
                return db.QueryEntity<UserInfo>(parameter);
            }
        }

        private static void WriteAddUserActionLog(LAPUserCriteria value)
        {
            var userId = AppSession.CurrentUser.Id;

            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)ActionLogType.LAPUser_Add,
                CustId = userId,
                UserId = userId,
                Doing = BuildAddingUserLogContent(value)
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }

        private static string BuildAddingUserLogContent(LAPUserCriteria value)
        {
            var result = new StringBuilder();

            result.Append("<Action value=\"AddNewUser\">");
            result.Append("<SpName>Nap_LM_LAPUser_Insert</SpName>");
            result.Append($"<CreatedBy UserId=\"{AppSession.CurrentUser.Id}\" UserName=\"{AppSession.CurrentUser.Username}\" />");
            result.Append($"<New UserID =\"{value.UserID}\" SiteName =\"{value.SiteName}\" />");
            result.Append("</Action>");

            return result.ToString();
        }

        private static void WriteUpdateUserPWActionLog(LAPUserCriteria value, bool isBackgroundJob)
        {
            var userId = isBackgroundJob ? int.Parse(ConfigurationManager.AppSettings["UserLoginIDForBackgroundJob"]) : AppSession.CurrentUser.Id;

            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)ActionLogType.LAPUser_UpdateUserPWD,
                CustId = userId,
                UserId = userId,
                Doing = BuildUpdatingUserLogContent(value, isBackgroundJob)
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }

        private static string UpdatingByUserLogContent(LAPUserCriteria value)
        {
            var result = new StringBuilder();

            result.Append($"<UpdatedBy UserId=\"{AppSession.CurrentUser.Id}\" UserName=\"{AppSession.CurrentUser.Username}\" />");
            result.Append($"<RequestBy =\"{value.RequestBy}\" />");
            result.Append($"<RedmineID =\"{value.RedmineID}\" />");

            return result.ToString();
        }

        private static string BuildUpdatingUserLogContent(LAPUserCriteria value, bool isBackgroundJob)
        {
            var result = new StringBuilder();
            var updatingByBackgroundJobLogContent = "<UpdatedBy Background Job />";

            result.Append("<Action value=\"UpdateUserPassword\">");
            result.Append("<SpName>Nap_LM_LAPUser_UpdatePW</SpName>");
            result.Append(isBackgroundJob ? updatingByBackgroundJobLogContent : UpdatingByUserLogContent(value));
            result.Append($"<UserID=\"{value.UserID}\" SiteName =\"{value.SiteName}\" />");
            result.Append("</Action>");

            return result.ToString();
        }
    }
}