namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Core;
    using Model.Criteria.Operator;
    using Model.DTO;

    public class ManageOperatorService : IManageOperatorService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;

        public ManageOperatorService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public IEnumerable<string> GetSiteNames()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_SubsidiarySiteName_Select"))
            {
                return db.Query<string>();
            }
        }

        public IEnumerable<Operator> GetOperators(SearchOperatorCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Select"))
            {
                return db.Query<Operator>(criteria);
            }
        }

        public Operator UpdateOperator(int agentId, string operatorId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Update"))
            {
                db.ExecuteNonQuery(new { AgentId = agentId, OperatorId = operatorId  });
                return GetOperator(agentId);
            }
        }

        public Operator AddOperator(OperatorCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Insert"))
            {
                db.ExecuteNonQuery(criteria);
                return GetOperator(criteria.AgentId);
            }
        }

        public Operator GetOperator(int agentId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Get"))
            {
                return db.QueryEntity<Operator>(new { AgentId = agentId });
            }
        }
    }
}