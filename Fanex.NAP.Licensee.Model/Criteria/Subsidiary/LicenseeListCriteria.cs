using Fanex.Data.Repository;

namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    public class LicenseeListCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "Acc_Dep_LicenseeSelAll";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}
