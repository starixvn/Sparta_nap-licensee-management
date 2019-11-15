namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Core;
    using Model.Criteria.LAPUser;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.Enumerations;
    using Newtonsoft.Json;

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
                FuncPermissions = BuildFunctionXMLParameter(criteria.FuncPermissions)
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

        public LAPUser GetUserInfo(string siteName, string userID)
        {
            var parameter = new
            {
                UserID = userID,
                SiteName = siteName
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_Select"))
            {
                return db.QueryEntity<LAPUser>(parameter);
            }
        }

        public UserPermissionInfo GetUserFuncPermissionInfo(int userSEQ)
        {
            var parameter = new
            {
                UserSEQ = userSEQ
            }; 
            var result = new UserPermissionInfo();

            using (var db = _objectDbGenerator.Create("Nap_LM_UserFuncPermission_Select"))
            {
                using (var multi = db.QueryMultiple(parameter))
                {
                    result.UserGroup = multi.Read<UserGroup>().FirstOrDefault();
                    result.FuncPermission = multi.Read<UserFuncPermission>();
                }
            }

            return result;
        }

        private static void WriteAddUserActionLog(LAPUserCriteria value)
        {
            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)ActionLogType.LAPUser_Add,
                CustId = value.UserLoginId,
                UserId = value.UserLoginId,
                Doing = BuildAddingUserLogContent(value)
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }

        private static string BuildAddingUserLogContent(LAPUserCriteria value)
        {
            var result = new StringBuilder();

            result.Append("<Action value=\"AddNewUser\">");
            result.Append("<SpName>Nap_LM_LAPUser_Insert</SpName>");
            result.Append($"<CreatedBy UserId=\"{value.UserLoginId}\" UserName=\"{value.UserLoginName}\" />");
            result.Append($"<FunctionPermisstion=\"{JsonConvert.SerializeObject(value.FuncPermissions)}\" />");
            result.Append($"<RequestBy=\"{value.RequestBy}\" />");
            result.Append($"<RedmineID=\"{value.RedmineID}\" />");
            result.Append($"<New UserID=\"{value.UserID}\" SiteName=\"{value.SiteName}\" />");
            result.Append("</Action>");

            return result.ToString();
        }

        private static void WriteUpdateUserPWActionLog(LAPUserCriteria value, bool isBackgroundJob)
        {
            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)ActionLogType.LAPUser_UpdateUserPWD,
                CustId = value.UserLoginId,
                UserId = value.UserLoginId,
                Doing = BuildUpdatingUserLogContent(value, isBackgroundJob)
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }

        private static string UpdatingByUserLogContent(LAPUserCriteria value)
        {
            var result = new StringBuilder();

            result.Append($"<UpdatedBy UserId=\"{value.UserLoginId}\" UserName=\"{value.UserLoginName}\" />");
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

        private static string BuildFunctionXMLParameter(IEnumerable<FunctionPermissionCriteria> criteria)
        {
            if (criteria == null || !criteria.Any())
            {
                return string.Empty;
            }

            var builder = new StringBuilder();
            builder.Append("<ROOT>");

            foreach (var item in criteria)
            {
                builder.Append($"<UserFuncPermission FunctionKey=\"{item.FunctionKey}\" SystemType=\"{item.SystemType}\" SubFunctionKeys=\"{item.SubFunctionKeys}\" />");
            }

            builder.Append("</ROOT>");

            return builder.ToString();
        }
    }
}