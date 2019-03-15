namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// Bet setting sport book view model.
    /// </summary>
    public class BSSportbookViewModel : BSBaseViewModel
    {
        public BSSportbookViewModel()
        {
        }

        public BSSportbookViewModel(IList<BSSportbookItem> lstItems, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSRowBaseViewModel>();

            foreach (var key in dctGameType.Keys)
            {
                BSRowBaseViewModel sportbookRowVM;
                BSSportbookItem item = lstItems.Where(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId).FirstOrDefault();
                if (item != null)
                {
                    sportbookRowVM = new BSRowBaseViewModel(
                        key.SportTypeId,
                        dctGameType[key],
                        key.BetTypeId,
                        dctGameType[key],
                        item.MinBet.ToString("0"),
                        item.MaxBet.ToString("0"),
                        item.MaxPerMatch.ToString("0"),
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

            IsApplyExistingMemberChecked = false;
        }

        public IList<BSRowBaseViewModel> BSRows { get; set; }

        public BSRowBaseViewModel SportBetSetting { get; set; }
    }
}
