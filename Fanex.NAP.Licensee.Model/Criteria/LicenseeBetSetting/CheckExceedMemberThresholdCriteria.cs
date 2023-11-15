namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeBetSetting
{
    using Fanex.Data.Repository;

    public class CheckExceedMemberThresholdCriteria : CriteriaBase
    {
        public CheckExceedMemberThresholdCriteria(int custId, int agentId)
        {
            CustId = custId;
            AgentId = agentId;
            IsSetting = 1;
        }

        public int CustId { get; set; }

        public int AgentId { get; set; }

        public byte IsSetting { get; set; }


        public override string GetSettingKey() => "NAP_LM_CustomerSelCheckAllowedDownlines";

        public override bool IsValid() => AgentId >= 0 && CustId > 0;
    }
}
