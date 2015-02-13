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
            BSRows = new List<BSRowBaseViewModel>();
            foreach (var key in dctGameType.Keys)
            {
                BSRowBaseViewModel sportbookRowVM;
                BSVirtualSportItem item = lstItems.Where(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId).FirstOrDefault();
                if (item != null)
                {
                    sportbookRowVM = new BSRowBaseViewModel(
                        key.SportTypeId,
                        dctGameType[key],
                        key.BetTypeId,
                        dctGameType[key],
                        ((int)item.MinBet).ToString(),
                        ((int)item.MaxBet).ToString(),
                        ((int)item.MaxPerMatch).ToString(),
                        false);
                }
                else
                {
                    sportbookRowVM = new BSRowBaseViewModel(
                        key.SportTypeId,
                        dctGameType[key],
                        key.BetTypeId,
                        dctGameType[key],
                        string.Empty,
                        string.Empty,
                        string.Empty,
                        false);
                }

                BSRows.Add(sportbookRowVM);
            }

            if (lstItems.Count != 0)
            {
                IsEnableChecked = !lstItems[0].DisableSuper;
                IsDownlineChecked = !lstItems[0].DisableDownline;
            }
            else
            {
                IsEnableChecked = false;
                IsDownlineChecked = false;
            }

            IsApplyExistingMemberChecked = false;

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
