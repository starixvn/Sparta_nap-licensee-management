namespace Fanex.NAP.Licensee.Service.Helpers
{
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

        public static void UpdateFunctionKeySelected(this LAPUserCriteria criteria)
        {
            var filePath = "~/App_Data/FunctionPermission.json";
            var jsonStr = System.IO.File.ReadAllText(HostingEnvironment.MapPath(filePath));
            var functionList = JArray.Parse(jsonStr).SelectTokens("..FunctionKey");

            if (criteria.FuncPermissions != null)
            {
                foreach (var item in criteria.FuncPermissions)
                {
                    if (item.SystemType == null)
                    {
                        foreach (var func in functionList)
                        {
                            if (func.ToString() == item.FunctionKey)
                            {
                                item.SystemType = func.Ancestors()
                                    .OfType<JObject>()
                                    .Select(x => x.Value<int>("Type"))
                                    .FirstOrDefault();
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
    }
}