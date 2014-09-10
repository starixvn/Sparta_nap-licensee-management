// -----------------------------------------------------------------------
// <copyright file="EditDefaultBetSetting.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.ViewModel
{
    using System;
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class EditDefaultBetSettingViewModel
    {
        public EditDefaultBetSettingViewModel()
        {
            this.Sportbook = new List<BetSettingBySport>();
            this.NumberGame = new List<BetSettingBySport>();
            this.VirtualSport = new List<BetSettingBySport>();
            this.Keno = new List<BetSettingBySport>();
        }

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
                return !string.IsNullOrEmpty(Licensee) && Currency.Id > 0;
            }
        }

        public EditingBetSettingCriteria ToCriteria
        {
            get
            {
                return new EditingBetSettingCriteria { };
            }
        }
    }
}