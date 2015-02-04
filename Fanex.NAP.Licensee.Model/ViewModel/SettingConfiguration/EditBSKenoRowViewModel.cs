namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Edit bet setting keno view model.
    /// </summary>
    public class EditBSKenoRowViewModel : BetSettingRowBaseViewModel
    {
        public EditBSKenoRowViewModel()
        {
        }

        public EditBSKenoRowViewModel(
            int betTypeId,
            string betTypeName,
            decimal minBet,
            decimal maxBet,
            decimal maxPerMatch,
            bool isSuperChecked,
            bool isDownlinesChecked)
        {
            BetTypeId = betTypeId;
            BetTypeName = betTypeName;

            MinBet = minBet;
            MaxBet = maxBet;
            MaxPerMatch = maxPerMatch;

            IsSuperChecked = isSuperChecked;
            IsDownlinesChecked = isDownlinesChecked;
        }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public bool IsBetTypeChecked { get; set; }

        public bool IsSuperChecked { get; set; }

        public bool IsDownlinesChecked { get; set; }

        public bool IsApplyExistingMemberChecked { get; set; }
    }
}
