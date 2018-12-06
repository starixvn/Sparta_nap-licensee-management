namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.Operator;
    using Model.DTO;

    public interface IManageOperatorService
    {
        IEnumerable<string> GetSiteNames();

        IEnumerable<Operator> GetOperators(SearchOperatorCriteria criteria);

        ResultData<Operator> AddOperator(OperatorCriteria criteria, int userId);

        ResultData<Operator> UpdateOperator(int agentId, string operatorId, int userId);

        Operator GetOperator(int agentId);

        Agent GetAgent(int agentId);

        IEnumerable<ImportOperatorResult> ImportOperators(string operatorXml, int userId);

        bool DeleteOperator(int agentId, int userId);
    }
}