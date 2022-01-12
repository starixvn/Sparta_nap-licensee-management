namespace Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration
{
    using Data.Repository;

    /// <summary>
    /// Update bet setting item.
    /// </summary>
    public class UpdateBetSettingItem : CriteriaBase
    {
        public UpdateBetSettingItem()
        {
            // Set default values
            BetType = 0;

            MaxPerBall = 0;

            Enable = false;
            EnableDownline = false;
        }

        public UpdateBetSettingItem(int custId, int sportTypeId, int betTypeId, decimal minBet, decimal maxBet, decimal maxPermatch, bool isApplyExistingMemberChecked)
            : this()
        {
            CustId = custId;
            SportType = sportTypeId;
            BetType = betTypeId;

            MinBet = minBet;
            MaxBet = maxBet;
            MaxPerMatch = maxPermatch;

            ExistedMember = isApplyExistingMemberChecked;
        }

        public UpdateBetSettingItem(
            int custId,
            int sportTypeId,
            int betTypeId,
            decimal minBet,
            decimal maxBet,
            decimal maxPermatch,
            bool isApplyExistingMemberChecked,
            int agentId, 
            bool isAgentOnly,
            bool updateMinBet,
            bool updateMaxBet,
            bool updateMBM)
            : this(custId, sportTypeId, betTypeId, minBet, maxBet, maxPermatch, isApplyExistingMemberChecked)
        {
            AgentId = agentId;
            UpdateMinBet = updateMinBet;
            UpdateMaxBet = updateMaxBet;
            UpdateMPM = updateMBM;
            IsAgentOnly = isAgentOnly;
        }

        public UpdateBetSettingItem(
            int custId,
            int sportTypeId,
            int betTypeId,
            decimal minBet,
            decimal maxBet,
            decimal maxPermatch,
            bool isSuperChecked,
            bool isDownlineChecked,
            bool isApplyExistingMemberChecked)
            : this(custId, sportTypeId, betTypeId, minBet, maxBet, maxPermatch, isApplyExistingMemberChecked)
        {
            Enable = isSuperChecked;
            EnableDownline = isDownlineChecked;
        }

        public int CustId { get; set; }

        public int SportType { get; set; }

        public int BetType { get; set; }

        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }

        public decimal MaxPerMatch { get; set; }

        public decimal MaxPerBall { get; set; }

        public bool ExistedMember { get; set; }

        public bool IsAgentOnly { get; set; }

        public int AgentId { get; set; }

        public bool UpdateMinBet { get; set; }

        public bool UpdateMaxBet { get; set; }

        public bool UpdateMPM { get; set; }

        public bool Enable { get; set; }

        public bool EnableDownline { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_LM_LicenseeBetSettingUpd";
        }

        public override bool IsValid()
        {
            return true;
        }
    }
}