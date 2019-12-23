namespace Fanex.NAP.Licensee.Service
{
    using Model.Criteria.LAPUser;
    using Model.DTO;

    public interface ILAPUserManagementService
    {
        ResultData<string> UpdateUser(LAPUserCriteria criteria);

        LAPUser GetUserInfo(string vendorId, string userID);

        ResultData<string> AddUser(LAPUserCriteria criteria);
    }
}