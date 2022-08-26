namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Bet setting row base view model.
    /// </summary>
    public class BSRowBaseViewModel
    {
        public BSRowBaseViewModel()
        {
        }

        public BSRowBaseViewModel(
            int sportTypeId,
            string sportTypeName,
            int betTypeId,
            string betTypeName,
            string minBet,
            string maxBet,
            string maxPerMatch,
            bool isRowSelected)
        {
            SportTypeId = sportTypeId;
            SportTypeName = sportTypeName;

            BetTypeId = betTypeId;
            BetTypeName = betTypeName;

            MinBet = minBet;
            MaxBet = maxBet;
            MaxPerMatch = maxPerMatch;

            IsRowSelected = isRowSelected;

            IsRowDisabled = false;
        }

        public BSRowBaseViewModel(
            int sportTypeId,
            string sportTypeName,
            int betTypeId,
            string betTypeName,
            string minBet,
            string maxBet,
            string maxPerMatch,
            string agentMinBet,
            string agentMaxBet,
            string agentMaxPerMatch,
            bool isRowSelected)
        {
            SportTypeId = sportTypeId;
            SportTypeName = sportTypeName;

            BetTypeId = betTypeId;
            BetTypeName = betTypeName;

            MinBet = minBet;
            MaxBet = maxBet;
            MaxPerMatch = maxPerMatch;

            AgentMinBet = agentMinBet;
            AgentMaxBet = agentMaxBet;
            AgentMaxPerMatch = agentMaxPerMatch;

            IsRowSelected = isRowSelected;

            IsRowDisabled = false;
        }
        public int SportTypeId { get; set; }

        public string SportTypeName { get; set; }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public string MinBet { get; set; }

        public string MaxBet { get; set; }

        public string MaxPerMatch { get; set; }

        public string MaxPayoutPerMatch { get; set; }

        public bool IsRowSelected { get; set; }

        public bool IsRowDisabled { get; set; }

        public string AgentMinBet { get; set; }

        public string AgentMaxBet { get; set; }

        public string AgentMaxPerMatch { get; set; }

        public string AgentMaxPayoutPerMatch { get; set; }
    }
}
