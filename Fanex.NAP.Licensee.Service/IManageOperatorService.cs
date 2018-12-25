namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.Operator;
    using Model.DTO;

    public interface IManageOperatorService
    {
        IEnumerable<string> GetSiteNames();

        ResultGridData<Operator> GetOperators(SearchOperatorCriteria criteria);

        ResultData<Operator> AddOperator(OperatorCriteria criteria);

        ResultData<Operator> UpdateOperator(int agentId, string operatorId);

        Operator GetOperator(int agentId);

        Agent GetAgent(int agentId);

        IEnumerable<ImportOperatorResult> ImportOperators(string operatorXml);

        bool DeleteOperator(int agentId);
    }
}