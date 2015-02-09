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

            IsApplyExistingMemberChecked = false;
        }

        public IList<BSRowBaseViewModel> BSRows { get; set; }
    }
}
