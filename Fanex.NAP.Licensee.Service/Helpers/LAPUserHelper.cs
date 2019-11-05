namespace Fanex.NAP.Licensee.Service.Helpers
{
    using Model.Enumerations;

    public static class LAPUserHelper
    {
        public static bool IsValidUserAccount(string userID)
        {
            return userID == LAPAccount.ITSupport || userID == LAPAccount.ITSupport2;
        }
    }
}
