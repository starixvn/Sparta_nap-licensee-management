namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
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
            string maxPayoutPerMatch,
            string upLineMinBet,
            string upLineMaxBet,
            string upLineMaxPerMatch,
            string upLineMaxPayoutPerMatch,
            bool isRowSelected)
        {
            SportTypeId = sportTypeId;
            SportTypeName = sportTypeName;

            BetTypeId = betTypeId;
            BetTypeName = betTypeName;

            MinBet = minBet;
            MaxBet = maxBet;
            MaxPerMatch = maxPerMatch;
            MaxPayoutPerMatch = maxPayoutPerMatch;

            UpLineMinBet = upLineMinBet;
            UpLineMaxBet = upLineMaxBet;
            UpLineMaxPerMatch = upLineMaxPerMatch;
            UpLineMaxPayoutPerMatch = upLineMaxPayoutPerMatch;

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

        public string UpLineMinBet { get; set; }

        public string UpLineMaxBet { get; set; }

        public string UpLineMaxPerMatch { get; set; }

        public string UpLineMaxPayoutPerMatch { get; set; }
    }
}
