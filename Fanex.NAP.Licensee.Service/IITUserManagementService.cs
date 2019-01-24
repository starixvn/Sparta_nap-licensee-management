namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.ITUser;
    using Model.DTO;

    public interface IITUserManagementService
    {
        ResultGridData<ITUser> GetUserList(SearchUserCriteria criteria);

        IEnumerable<OptionItem> GetLicenseeUserList(int userId);

        IEnumerable<ResultInfo> Assign(AssignUserCriteria criteria);
    }
}