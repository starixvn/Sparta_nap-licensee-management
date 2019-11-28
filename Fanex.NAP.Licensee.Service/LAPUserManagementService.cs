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
                FuncPermissions = BuildFunctionXMLParameter(criteria.FuncPermissions),
                criteria.Currency
            };

            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_Insert"))
            {
                result.IsSuccess = (int)db.ExecuteScalar(parameter) == 1;
            }

            WriteAddUserActionLog(criteria);

            return result;
        }

        public ResultData<string> UpdateUser(LAPUserCriteria criteria)
        {
            var result = new ResultData<string>();

            var userInfo = GetUserInfo(criteria.VendorId, criteria.SiteName, criteria.UserID);
            var parameter = new
            {
                userInfo.UserSEQ,
                criteria.SiteName,
                criteria.UserPWD,
                FuncPermissions = BuildFunctionXMLParameter(criteria.FuncPermissions),
                criteria.OldUserGroupSEQ,
                criteria.Currency
            };

            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_Update"))
            {
                result.IsSuccess = (int)db.ExecuteScalar(parameter) == 1;
            }

            WriteUpdateUserActionLog(criteria);

            return result;
        }

        public LAPUser GetUserInfo(string vendorId, string siteName, string userID)
        {
            LAPUser user;
            var userPermission = new UserPermissionInfo();
            var currency = string.Empty;
            var functionIgnore = string.Empty;

            var parameter = new
            {
                VendorID = vendorId,
                UserID = userID,
                SiteName = siteName
            };

            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_Select"))
            {
                using (var multi = db.QueryMultiple(parameter))
                {
                    functionIgnore = multi.Read<string>().FirstOrDefault();
                    user = multi.Read<LAPUser>().FirstOrDefault();
                    userPermission.UserGroup = multi.Read<UserGroup>().FirstOrDefault();
                    userPermission.FuncPermission = multi.Read<UserFuncPermission>();
                    currency = multi.Read<string>().FirstOrDefault();
                }
            }

            if (user != null)
            {
                user.UserPermission = userPermission;
                user.Currency = currency;
                user.FunctionIgnore = functionIgnore;
            }
            else
            {
                user = new LAPUser();
                user.FunctionIgnore = functionIgnore;
            }

            return user;
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
            result.Append($"<Curency=\"{value.Currency}\" />");
            result.Append($"<RequestBy=\"{value.RequestBy}\" />");
            result.Append($"<RedmineID=\"{value.RedmineID}\" />");
            result.Append($"<New UserID=\"{value.UserID}\" SiteName=\"{value.SiteName}\" />");
            result.Append("</Action>");

            return result.ToString();
        }

        private static void WriteUpdateUserActionLog(LAPUserCriteria value)
        {
            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)ActionLogType.LAPUser_UpdateUser,
                CustId = value.UserLoginId,
                UserId = value.UserLoginId,
                Doing = BuildUpdatingUserLogContent(value)
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }

        private static string BuildUpdatingUserLogContent(LAPUserCriteria value)
        {
            var result = new StringBuilder();

            result.Append("<Action value=\"UpdateUserPassword\">");
            result.Append("<SpName>Nap_LM_LAPUser_UpdatePW</SpName>");
            result.Append($"<UpdatedBy UserId=\"{value.UserLoginId}\" UserName=\"{value.UserLoginName}\" />");
            result.Append($"<RequestBy =\"{value.RequestBy}\" />");
            result.Append($"<RedmineID =\"{value.RedmineID}\" />");
            result.Append($"<UserID=\"{value.UserID}\" SiteName =\"{value.SiteName}\" />");
            result.Append($"<NewFunction=\"{JsonConvert.SerializeObject(value.FuncPermissions)}\" />");
            result.Append($"<RemoveUserGroup=\"{value.OldUserGroupSEQ}\" />");
            result.Append($"<NewCurency=\"{value.Currency}\" />");
            result.Append("</Action>");

            return result.ToString();
        }

        private static string BuildFunctionXMLParameter(IEnumerable<FunctionPermissionCriteria> criteria)
        {
            var builder = new StringBuilder();
            builder.Append("<ROOT>");

            if (criteria != null && criteria.Any())
            {
                foreach (var item in criteria)
                {
                    builder.Append($"<UserFuncPermission FunctionKey=\"{item.FunctionKey}\" SystemType=\"{item.Type}\" SubFunctionKeys=\"{item.SubFunctionKeys}\" />");
                }
            }

            builder.Append("</ROOT>");

            return builder.ToString();
        }
    }
}