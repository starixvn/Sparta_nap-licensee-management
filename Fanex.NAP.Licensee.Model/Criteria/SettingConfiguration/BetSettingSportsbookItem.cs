namespace Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration
{
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration;
    using System.Collections.Generic;
    using System.Text;

    public class BetSettingSportsbookItem
    {
        private const string BSPattern = "<BL SportType=\"{0}\" Bettype=\"{1}\" MinBet=\"{2}\" MaxBet=\"{3}\" MaxPerMatch=\"{4}\" MaxPerNumber=\"{5}\" MaxPayoutPerMatch=\"{6}\"/>";

        [SpParam(SqlParamName = "CustID")]
        public int CustId { get; set; }

        [SpParam(SqlParamName = "AgentID")]
        public int AgentId { get; set; }

        [SpParam(Ignored = true)]
        public int SportTypeId { get; set; }

        [SpParam(Ignored = true)]
        public int BetTypeId { get; set; }

        [SpParam(Ignored = true)]
        public decimal MinBet { get; set; }

        [SpParam(Ignored = true)]
        public decimal MaxBet { get; set; }

        [SpParam(Ignored = true)]
        public decimal MaxPerMatch { get; set; }

        [SpParam(Ignored = true)]
        public decimal MaxPerNumber { get; set; }

        [SpParam(Ignored = true)]
        public decimal MaxPayoutPerMatch { get; set; }

        public bool Option { get; set; }

        public bool ExistedMember { get; set; }

        public bool IsNewMember { get; set; }

        [SpParam(Ignored = true)]
        public IList<BSRowBaseViewModel> DBSRows { get; set; }

        [SpParam(Ignored = true)]
        public IList<BSRowBaseViewModel> BSRows { get; set; }

        public string UpdNewMember
        {
            get
            {
                if (DBSRows == null || DBSRows.Count == 0)
                {
                    return string.Empty;
                }

                var updNewMember = new StringBuilder("<ROOT>");
                ToXmlSetting(updNewMember, DBSRows);
                updNewMember.Append("</ROOT>");

                return updNewMember.ToString();
            }
        }

        public string UpdBetLimit
        {
            get
            {
                var updBetLimit = new StringBuilder("<ROOT>");
                if (BSRows == null || BSRows.Count == 0)
                {
                    var line = string.Format(BSPattern, SportTypeId, BetTypeId, MinBet, MaxBet, MaxPerMatch, null, MaxPayoutPerMatch);
                    updBetLimit.Append(line);
                }
                else
                {
                    ToXmlSetting(updBetLimit, BSRows);
                }
                updBetLimit.Append("</ROOT>");

                return updBetLimit.ToString();
            }
        }

        private void ToXmlSetting(StringBuilder str, IEnumerable<BSRowBaseViewModel> rows)
        {
            foreach (var i in rows)
            {
                var line = string.Format(BSPattern, i.SportTypeId, i.BetTypeId, i.MinBet, i.MaxBet, i.MaxPerMatch, null, i.MaxPayoutPerMatch);
                str.Append(line);
            }
        }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }
    }
}
