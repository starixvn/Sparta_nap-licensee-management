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

        public IEnumerable<Operator> GetOperators(OperatorCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Select"))
            {
                return db.Query<Operator>(criteria);
            }
        }
    }
}