namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Core;
    using Data;
    using Model.Criteria.LAPUser;
    using Model.Criteria.Vendor;
    using Model.DataDomain;
    using Model.DTO;
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
                criteria.VendorId,
                criteria.UserID,
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

            var userInfo = GetUserInfo(criteria.VendorId, criteria.UserID);
            var parameter = new
            {
                userInfo.UserSEQ,
                userInfo.VendorInfo.VendorID,
                criteria.UserPWD,
                FuncPermissions = BuildFunctionXMLParameter(criteria.FuncPermissions),
                criteria.IsRemoveGroup,
                criteria.Currency
            };

            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_Update"))
            {
                result.IsSuccess = (int)db.ExecuteScalar(parameter) == 1;
            }

            WriteUpdateUserActionLog(criteria);

            return result;
        }

        public LAPUser GetUserInfo(string vendorId, string userID)
        {
            LAPUser user;
            var result = new object[] { new LAPVendorInfo(), new LAPUser(), new UserGroup(), new List<UserFuncPermission>() { }, new List<UserFuncPermission>() { }, string.Empty };
            var mappingTypes = new object[] { new LAPVendorInfo(), new LAPUser(), new UserGroup(), new UserFuncPermission(), new UserFuncPermission(), string.Empty };
            var parameter = new
            {
                VendorID = vendorId ?? string.Empty,
                UserID = userID ?? string.Empty,
            };

            using (var objectDb = ObjectDbFactory.CreateInstance("Nap_LM_LAPUser_Select"))
            {
                using (var multiResultReader = objectDb.QueryMultiple(parameter))
                {
                    var index = 0;

                    while (!multiResultReader.IsEmptyOrClosed && index < result.Length)
                    {
                        result[index] = multiResultReader.Read(mappingTypes[index].GetType());
                        index++;
                    }
                }
            }

            user = (LAPUser)(result[1] as IEnumerable<object>)?.FirstOrDefault();

            if (user != null)
            {
                user.UserPermission = new UserPermissionInfo();
                user.VendorInfo = (LAPVendorInfo)(result[0] as IEnumerable<object>)?.FirstOrDefault();
                user.UserPermission.UserGroup = (UserGroup)(result[2] as IEnumerable<object>)?.FirstOrDefault();
                user.Currency = (string)(result[5] as IEnumerable<object>)?.FirstOrDefault();
                if (result[4] != null)
                {
                    user.UserPermission.FuncPermission = (result[4] as IEnumerable<object>)?.Select(x => (UserFuncPermission)x);
                }

                if (user.UserPermission.UserGroup != null && result[3] != null)
                {
                    user.UserPermission.UserGroup.FuncPermission = (result[3] as IEnumerable<object>)?.Select(x => (UserFuncPermission)x);
                }
            }
            else
            {
                user = new LAPUser
                {
                    VendorInfo = (LAPVendorInfo)(result[0] as IEnumerable<object>).FirstOrDefault()
                };
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
            result.Append($"<New UserID=\"{value.UserID}\" SiteName=\"{value.VendorId}\" />");
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
            result.Append("<SpName>Nap_LM_LAPUser_Update</SpName>");
            result.Append($"<UpdatedBy UserId=\"{value.UserLoginId}\" UserName=\"{value.UserLoginName}\" />");
            result.Append($"<RequestBy =\"{value.RequestBy}\" />");
            result.Append($"<RedmineID =\"{value.RedmineID}\" />");
            result.Append($"<UserID=\"{value.UserID}\" VendorId =\"{value.VendorId}\" />");
            result.Append($"<NewFunction=\"{JsonConvert.SerializeObject(value.FuncPermissions)}\" />");
            result.Append($"<IsRemoveUserGroup=\"{value.IsRemoveGroup}\" />");
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