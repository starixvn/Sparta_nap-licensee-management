namespace Fanex.NAP.Licensee.Service
{
    using Model.Criteria.LAPUser;
    using Model.DTO;

    public interface ILAPUserManagementService
    {
        ResultData<string> UpdateUserPassword(LAPUserCriteria criteria, bool isBackgroundJob = false);

        UserInfo GetUserInfo(string siteName, string userID);

        ResultData<int> AddUser(LAPUserCriteria criteria);
    }
}