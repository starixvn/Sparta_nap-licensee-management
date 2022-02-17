namespace Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration
{
    using Data.Repository;

    /// <summary>
    /// Update bet setting item.
    /// </summary>
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