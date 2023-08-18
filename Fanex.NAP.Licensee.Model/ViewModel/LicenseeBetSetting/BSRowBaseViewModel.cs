namespace Fanex.NAP.Licensee.Model.ViewModel.LicenseeBetSetting
{
    public class BSRowBaseViewModel
    {
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

        public bool IsRowUpdated { get; set; }

        public string UplineMinBet { get; set; }

        public string UplineMaxBet { get; set; }

        public string UplineMaxPerMatch { get; set; }

        public string UplineMaxPayoutPerMatch { get; set; }
    }
}
