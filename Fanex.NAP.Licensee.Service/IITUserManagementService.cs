namespace Fanex.NAP.Licensee.Service
{
    using Model.Criteria.ITUser;
    using Model.DTO;

    public interface IITUserManagementService
    {
        ResultGridData<ITUser> GetUserList(SearchUserCriteria criteria);
    }
}