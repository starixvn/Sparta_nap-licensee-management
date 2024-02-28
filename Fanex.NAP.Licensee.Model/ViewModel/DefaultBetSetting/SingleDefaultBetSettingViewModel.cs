namespace Fanex.NAP.Licensee.Model.ViewModel.DefaultBetSetting
{
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    [Serializable]
    public class SingleDefaultBetSettingViewModel
    {
        private readonly string _xmlParameterPattern = "<setting sporttype=\"{0}\" bettype=\"{1}\" {2} ></setting>";
        private readonly string _xmlSettingPattern = "maxbet=\"{0}\" maxpermatch=\"{1}\"";
        private readonly string _xmlSBSettingPattern = "minbet=\"{0}\" maxbet=\"{1}\" maxpermatch=\"{2}\" maxpayoutpermatch=\"{3}\"";
        private readonly string _xmlNumberGameSettingPattern = "maxbet=\"{0}\" maxpermatch=\"{1}\" maxperball=\"{2}\"";
        private readonly string _xmlNoneMaxperMatchNumberGameSettingPattern = "maxbet=\"{0}\" maxperball=\"{1}\"";

        public SingleDefaultBetSettingViewModel()
        {
            this.Sportsbook = new List<BetSettingBySport>();
            this.NumberGame = new List<BetSettingBySport>();
            this.Keno = new List<BetSettingBySport>();
        }

        public int UserId { get; set; }

        public string IP { get; set; }

        public bool HasSetting { get; set; }

        public string Licensee { get; set; }

        public CurrencyItem Currency { get; set; }

        public AgentItem Agent { get; set; }

        public IList<BetSettingBySport> Sportsbook { get; set; }

        public IList<BetSettingBySport> NumberGame { get; set; }

        public IList<BetSettingBySport> Keno { get; set; }

        public bool IsValid
        {
            get
            {
                var validSports = Sportsbook.All(i => i.IsValid)
                                  && NumberGame.All(i => i.IsValid)
                                  && Keno.All(i => i.IsValid);

                return !string.IsNullOrEmpty(Licensee)
                       && Currency != null && Currency.Id > 0
                       && validSports;
            }
        }

        public InsertOrUpdateDefaultBetSetting ToCriteria
        {
            get
            {
                return new InsertOrUpdateDefaultBetSetting
                {
                    Licensee = Licensee,
                    CurrencyID = Currency.Id,
                    AgentID = Agent.Id,
                    UserID = UserId,
                    IP = IP,
                    Settings = this.ToXmlSetting
                };
            }
        }

        private string ToXmlSetting
        {
            get
            {
                var result = new StringBuilder();
                result.Append("<settings>");
                foreach (var sb in Sportsbook)
                {
                    var settingAttributes = sb.MinBet != null ? string.Format(_xmlSBSettingPattern, sb.MinBet, sb.MaxBet, sb.MaxPerMatch, sb.MaxPayoutPerMatch) : string.Empty;
                    result.Append(string.Format(_xmlParameterPattern, sb.SportOrGame.Id, sb.BetType, settingAttributes));
                }

                foreach (var ng in NumberGame)
                {
                    var settingAttributes = string.Empty;

                    if (ng.MaxBet != null)
                    {
                        settingAttributes = ng.MaxPerMatch != null
                            ? string.Format(_xmlNumberGameSettingPattern, ng.MaxBet, ng.MaxPerMatch, ng.MaxPerBall)
                            : string.Format(_xmlNoneMaxperMatchNumberGameSettingPattern, ng.MaxBet, ng.MaxPerBall);
                    }

                    result.Append(string.Format(_xmlParameterPattern, ng.SportOrGame.Id, ng.BetType, settingAttributes));
                }

                foreach (var kn in Keno)
                {
                    var settingAttributes = kn.MaxBet != null ? string.Format(_xmlSettingPattern, kn.MaxBet, kn.MaxPerMatch) : string.Empty;
                    result.Append(string.Format(_xmlParameterPattern, kn.SportOrGame.Id, kn.BetType, settingAttributes));
                }

                result.Append("</settings>");
                return result.ToString();
            }
        }
    }
}