namespace Fanex.NAP.Licensee.Service.Helpers
{
    using Model.Criteria.LAPUser;
    using Model.Enumerations;

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
    }
}