// -----------------------------------------------------------------------
// <copyright file="EditDefaultBetSetting.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.ViewModel
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class SingleDefaultBetSettingViewModel
    {
        private readonly string _xmlParameterPattern = "<setting sporttype=\"{0}\" bettype=\"{1}\" {2} ></setting>";
        private readonly string _xmlSettingPattern = "maxbet=\"{0}\" maxpermatch=\"{1}\"";
        private readonly string _xmlNumberGameSettingPattern = "maxbet=\"{0}\" maxpermatch=\"{1}\" maxperball=\"{2}\"";

        public SingleDefaultBetSettingViewModel()
        {
            this.Sportbook = new List<BetSettingBySport>();
            this.NumberGame = new List<BetSettingBySport>();
            this.VirtualSport = new List<BetSettingBySport>();
            this.Keno = new List<BetSettingBySport>();
        }

        public int UserId { get; set; }

        public string IP { get; set; }

        public bool HasSetting { get; set; }

        public string Licensee { get; set; }

        public CurrencyItem Currency { get; set; }

        public int? AgentId { get; set; }

        public string AgentName { get; set; }

        public IList<BetSettingBySport> Sportbook { get; set; }

        public IList<BetSettingBySport> NumberGame { get; set; }

        public IList<BetSettingBySport> VirtualSport { get; set; }

        public IList<BetSettingBySport> Keno { get; set; }

        public bool IsValid
        {
            get
            {
                return !string.IsNullOrEmpty(Licensee) && Currency != null && Currency.Id > 0 && !Sportbook.Any(i => !i.IsValid)
                    && !NumberGame.Any(i => !i.IsValid) && !VirtualSport.Any(i => !i.IsValid) && !Keno.Any(i => !i.IsValid);
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
                    AgentID = AgentId,
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
                foreach (var sb in Sportbook)
                {
                    var settingAttributes = sb.MaxBet != null ? string.Format(_xmlSettingPattern, sb.MaxBet, sb.MaxPerMatch) : "";
                    result.Append(string.Format(_xmlParameterPattern, sb.SportOrGame.Id, sb.BetType, settingAttributes));
                }
                foreach (var vs in VirtualSport)
                {
                    var settingAttributes = vs.MaxBet != null ? string.Format(_xmlSettingPattern, vs.MaxBet, vs.MaxPerMatch) : "";
                    result.Append(string.Format(_xmlParameterPattern, vs.SportOrGame.Id, vs.BetType, settingAttributes));
                }
                foreach (var ng in NumberGame)
                {
                    var settingAttributes = ng.MaxBet != null ? string.Format(_xmlNumberGameSettingPattern, ng.MaxBet, ng.MaxPerMatch, ng.MaxPerBall) : "";
                    result.Append(string.Format(_xmlParameterPattern, ng.SportOrGame.Id, ng.BetType, settingAttributes));
                }
                foreach (var kn in Keno)
                {
                    var settingAttributes = kn.MaxBet != null ? string.Format(_xmlSettingPattern, kn.MaxBet, kn.MaxPerMatch) : "";
                    result.Append(string.Format(_xmlParameterPattern, kn.SportOrGame.Id, kn.BetType, settingAttributes));
                }
                result.Append("</settings>");
                return result.ToString();
            }
        }
    }
}