namespace Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration
{
    using Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public class BetSettingSportsbookItemBase
    {
        private const string BSPattern = "<BL SportType=\"{0}\" Bettype=\"{1}\" MinBet=\"{2}\" MaxBet=\"{3}\" MaxPerMatch=\"{4}\" MaxPerNumber=\"{5}\" MaxPayoutPerMatch=\"{6}\"/>";

        public int CustId { get; set; }

        public int AgentId { get; set; }

        public bool Option { get; set; }

        public bool ExistedMember { get; set; }

        public bool IsNewMember { get; set; }

        public string UpdNewMember { get; set; }

        public string UpdBetLimit { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public string ToXmlSetting(IEnumerable<BSRowBaseViewModel> rows)
        {
            if (rows == null || !rows.Any())
            {
                return string.Empty;
            }

            var xml = new StringBuilder("<ROOT>");
            foreach (var line in rows.Select(i => string.Format(BSPattern, i.SportTypeId, i.BetTypeId, i.MinBet, i.MaxBet, i.MaxPerMatch, null, i.MaxPayoutPerMatch)))
            {
                xml.Append(line);
            }
            xml.Append("</ROOT>");

            return xml.ToString();
        }
    }
}
