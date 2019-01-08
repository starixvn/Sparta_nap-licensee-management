namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.LrfFunction;
    using Model.DTO;
    using NAP.Core.Models;

    public interface IManageLrfFunctionService
    {
        IEnumerable<OptionItem> GetGroupFunctionList();

        ResultGridData<LrfFunction> GetFunctionList(LrfFunctionCriteria criteria);
    }
}