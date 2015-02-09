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
            decimal minBet,
            decimal maxBet,
            decimal maxPerMatch,
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
        }

        public int SportTypeId { get; set; }

        public string SportTypeName { get; set; }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }

        public decimal MaxPerMatch { get; set; }

        public bool IsRowSelected { get; set; }
    }
}
