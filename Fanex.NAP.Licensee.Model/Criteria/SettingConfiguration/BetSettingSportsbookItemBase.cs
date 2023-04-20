namespace Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration
{
    public class BetSettingSportsbookItemBase
    {
        public int CustId { get; set; }

        public int AgentId { get; set; }

        public bool Option { get; set; }

        public bool ExistedMember { get; set; }

        public bool IsNewMember { get; set; }

        public string UpdNewMember { get; set; }

        public string UpdBetLimit { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }
    }
}
