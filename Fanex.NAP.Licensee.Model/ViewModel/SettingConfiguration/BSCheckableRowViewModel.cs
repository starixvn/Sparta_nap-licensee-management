namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

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
            decimal minBet,
            decimal maxBet,
            decimal maxPerMatch,
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
            IsSuperDisabled = IsSuperChecked == true ? true : false;
            IsDownlineDisabled = IsDownlineChecked == true ? true : false;
        }

        public bool IsSuperChecked { get; set; }

        public bool IsSuperDisabled { get; set; }

        public bool IsDownlineChecked { get; set; }

        public bool IsDownlineDisabled { get; set; }

        public int RowSpan { get; set; }
    }
}
