namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.LrfFunction;
    using Model.DTO;

    public interface IManageLrfFunctionService
    {
        IEnumerable<OptionItem> GetGroupFunctionList();

        ResultGridData<LrfFunctionHierarchy> GetFunctionList(int parentFunctionId);

        IEnumerable<OptionItem> GetParentFunctionList(int functionId);

        LrfFunction GetFunction(int id);

        ResultData<LrfFunction> Insert(LrfFunctionCriteria criteria);

        ResultData<LrfFunction> Update(LrfFunctionCriteria criteria);

        IEnumerable<OptionItem> GetLicenseeFunctionList(int functionId);

        IEnumerable<ResultInfo> Assign(AssignLrfFunctionCriteria criteria);

        IEnumerable<OptionItem> GetFunctionList();
    }
}