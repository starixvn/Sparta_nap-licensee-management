using Fanex.Data.Repository;

namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    public class GetSiteDbConfigCriteria : CriteriaBase
    {
        public GetSiteDbConfigCriteria()
        {
            SiteDbGroupId = 0;
        }

        public int CustId { get; set; }

        public string Username { get; set; } = "";

        public int SiteDbGroupId { get; set; }

        public override string GetSettingKey()
        {
            return "Acc_SiteDBConfigSel";
        }

        public override bool IsValid()
        {
            return CustId > 0;
        }
    }
}
