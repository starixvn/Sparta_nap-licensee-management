namespace Fanex.NAP.Licensee.Service.Helpers
{
    using System;
    using System.Linq;
    using System.Web.Hosting;
    using Model.Criteria.LAPUser;
    using Model.Enumerations;
    using Newtonsoft.Json.Linq;

    public static class LAPUserHelper
    {
        public static bool IsValidUserAccount(string userID)
        {
            return userID == LAPAccount.ITSupport || userID == LAPAccount.ITSupport2;
        }

        public static void UpdateUserLoginInfo(this LAPUserCriteria criteria)
        {
            criteria.UserLoginId = AppSession.CurrentUser.Id;
            criteria.UserLoginName = AppSession.CurrentUser.Username;
        }

        public static void UpdatePassword(this LAPUserCriteria criteria, string originalPass)
        {
            criteria.UserPWD = SecurityHelper.EncryptPass(originalPass);
        }

        public static void UpdateFunctionKeySelectedInfo(this LAPUserCriteria criteria)
        {
            var filePath = "~/App_Data/FunctionPermission.json";
            var jsonStr = System.IO.File.ReadAllText(HostingEnvironment.MapPath(filePath));
            var functionList = JArray.Parse(jsonStr).SelectTokens("..FunctionKey");

            if (criteria.FuncPermissions != null)
            {
                foreach (var item in criteria.FuncPermissions)
                {
                    if (item.Type == null)
                    {
                        foreach (var func in functionList)
                        {
                            if (func.ToString() == item.FunctionKey)
                            {
                                var nearestType = func.Ancestors()
                                    .OfType<JObject>()
                                    .Select(x => x.Value<string>("Type"))
                                    .FirstOrDefault(x => x != null);

                                item.Type = Convert.ToInt32(nearestType);
                            }
                        }
                    }

                    if (item.SubFunctionKeys != null)
                    {
                        item.SubFunctionKeys = item.SubFunctionKeys.Replace("\"", "&quot;");
                    }
                }
            }
        }

        public static void RemoveUnusefulInfoForBackgroundJob(this LAPUserCriteria criteria)
        {
            criteria.FuncPermissions = Enumerable.Empty<FunctionPermissionCriteria>();
        }

        public static void UpdateLAPUserInfo(this LAPUserCriteria criteria, string originalPass)
        {
            criteria.UpdatePassword(originalPass);
            criteria.UpdateUserLoginInfo();
            criteria.UpdateFunctionKeySelectedInfo();
        }
    }
}