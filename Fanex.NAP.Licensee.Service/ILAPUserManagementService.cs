namespace Fanex.NAP.Licensee.Service
{
    using Model.Criteria.LAPUser;
    using Model.DTO;

    public interface ILAPUserManagementService
    {
        ResultData<string> UpdateUserPassword(LAPUserCriteria criteria, bool isBackgroundJob = false);

        LAPUser GetUserInfo(string siteName, string userID);

        ResultData<string> AddUser(LAPUserCriteria criteria);

        UserPermissionInfo GetUserFuncPermissionInfo(int userSEQ);
    }
}