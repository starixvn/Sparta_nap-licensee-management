namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.ITUser;
    using Model.DTO;

    public interface IITUserManagementService
    {
        ResultGridData<ITUser> GetUserList(SearchUserCriteria criteria);

        IEnumerable<ITUserLicensee> GetLicenseeUserList(int userId, bool? isAssigned = null);

        IEnumerable<ResultInfo> AssignUser(AssignUserCriteria criteria);

        IEnumerable<ITUserLicenseeFunction> GetLicenseeUserFunction(UserLicenseeFunctionCriteria criteria);

        IEnumerable<ResultInfo> EditFunction(EditFunctionCriteria criteria);

        IEnumerable<ITUserLicenseeCurrency> GetLicenseeUserCurrency(UserLicenseeCurrencyCriteria criteria);

        IEnumerable<ResultInfo> EditCurrency(EditCurrencyCriteria criteria);

        IEnumerable<ResultInfo> AddUser(AddUserCriteria criteria);

        ITUser Get(int userId);
    }
}