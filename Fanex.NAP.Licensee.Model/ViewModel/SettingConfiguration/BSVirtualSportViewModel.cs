namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// Bet setting virtual sport view model.
    /// </summary>
    public class BSVirtualSportViewModel : BSBaseViewModel
    {
        public BSVirtualSportViewModel()
        {
        }

        public BSVirtualSportViewModel(IList<BSVirtualSportItem> lstItems, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSRowBaseViewModel>();
            foreach (BSBaseItem item in lstItems)
            {
                BSRowBaseViewModel sportbookRowVM = new BSRowBaseViewModel(
                    item.SportTypeId,
                    dctGameType[dctGameType.Keys.First(k => k.SportTypeId == item.SportTypeId && k.BetTypeId == item.BetTypeId)],
                    item.BetTypeId,
                    dctGameType[dctGameType.Keys.First(k => k.SportTypeId == item.SportTypeId && k.BetTypeId == item.BetTypeId)],
                    item.MinBet,
                    item.MaxBet,
                    item.MaxPerMatch,
                    false);

                BSRows.Add(sportbookRowVM);
            }

            IsEnableChecked = !lstItems[0].DisableSuper;
            IsDownlineChecked = !lstItems[0].DisableDownline;

            IsApplyExistingMemberChecked = false;

            // Derived props
            IsEnableDisabled = IsEnableChecked == true ? true : false;
            IsDownlineDisabled = IsDownlineChecked == true ? true : false;
        }

        public bool IsEnableChecked { get; set; }

        public bool IsEnableDisabled { get; set; }

        public bool IsDownlineChecked { get; set; }

        public bool IsDownlineDisabled { get; set; }

        public IList<BSRowBaseViewModel> BSRows { get; set; }
    }
}
