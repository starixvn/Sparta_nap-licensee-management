namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    /// <summary>
    /// Bet setting checkable row view model.
    /// </summary>
    public class BSCheckableRowViewModel : BSRowBaseViewModel
    {
        public BSCheckableRowViewModel()
        {
        }

        public BSCheckableRowViewModel(
            int sportTypeId,
            string sportTypeName,
            int betTypeId,
            string betTypeName,
            string minBet,
            string maxBet,
            string maxPerMatch,
            bool isSuperChecked,
            bool isDownlineChecked,
            bool isRowSelected,
            int rowSpan = -1)
            : base(sportTypeId, sportTypeName, betTypeId, betTypeName, minBet, maxBet, maxPerMatch, isRowSelected)
        {
            IsSuperChecked = isSuperChecked;
            IsDownlineChecked = isDownlineChecked;

            RowSpan = rowSpan;

            // Derived props
            IsSuperDisabled = IsSuperChecked;
            IsDownlineDisabled = IsDownlineChecked;
        }

        public bool IsSuperChecked { get; set; }

        public bool IsSuperDisabled { get; set; }

        public bool IsDownlineChecked { get; set; }

        public bool IsDownlineDisabled { get; set; }

        public int RowSpan { get; set; }
    }
}
