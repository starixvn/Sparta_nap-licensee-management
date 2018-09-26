namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.Operator;
    using Model.DTO;

    public interface IManageOperatorService
    {
        IEnumerable<string> GetSiteNames();

        IEnumerable<Operator> GetOperators(SearchOperatorCriteria criteria);

        Operator AddOperator(OperatorCriteria criteria);

        Operator UpdateOperator(int agentId, string operatorId);

        Operator GetOperator(int agentId);
    }
}