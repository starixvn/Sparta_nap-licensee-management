namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeBetSetting
{
    using Fanex.Data.Repository;

    public class GetLicenseeAgentList : CriteriaBase
    {
        public int SRecommend { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_LM_LicenseeSelAgentList";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}