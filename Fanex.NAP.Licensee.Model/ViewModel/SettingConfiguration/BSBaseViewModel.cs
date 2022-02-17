namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Bet setting base view model.
    /// </summary>
    public class BSBaseViewModel
    {
        public int CustId { get; set; }

        public int ProdId { get; set; }

        public bool IsApplyExistingMemberChecked { get; set; }

        public bool IsAgentOnly { get; set; }

        public int AgentId { get; set; }

        public bool UpdateMinBet { get; set; }

        public bool UpdateMaxBet { get; set; }

        public bool UpdateMPM { get; set; }
    }
}
