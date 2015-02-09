namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// Bet setting number game view model.
    /// </summary>
    public class BSNumberGameViewModel : BSBaseViewModel
    {
        public BSNumberGameViewModel()
        {
        }

        public BSNumberGameViewModel(IList<BSNumberGameItem> lstItems, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSNumberGameRowViewModel>();
            foreach (BSNumberGameItem item in lstItems)
            {
                BSNumberGameRowViewModel numberGameRowVM = new BSNumberGameRowViewModel(
                    item.SportTypeId,
                    dctGameType[dctGameType.Keys.First(k => k.SportTypeId == item.SportTypeId && k.BetTypeId == item.BetTypeId)],
                    item.BetTypeId,
                    dctGameType[dctGameType.Keys.First(k => k.SportTypeId == item.SportTypeId && k.BetTypeId == item.BetTypeId)],
                    item.MinBet,
                    item.MaxBet,
                    item.MaxPerMatch,
                    item.MaxPerBall);

                BSRows.Add(numberGameRowVM);
            }

            IsApplyExistingMemberChecked = false;
        }

        public IList<BSNumberGameRowViewModel> BSRows { get; set; }
    }
}
