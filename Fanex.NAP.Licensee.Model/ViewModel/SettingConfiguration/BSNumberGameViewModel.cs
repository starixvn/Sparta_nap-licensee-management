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

            foreach (var key in dctGameType.Keys)
            {
                BSNumberGameRowViewModel numberGameRowVM;
                BSNumberGameItem item = lstItems.Where(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId).FirstOrDefault();
                if (item != null)
                {
                    numberGameRowVM = new BSNumberGameRowViewModel(
                        key.SportTypeId,
                        dctGameType[key],
                        key.BetTypeId,
                        dctGameType[key],
                        item.MinBet.ToString("0"),
                        item.MaxBet.ToString("0"),
                        item.MaxPerMatch.ToString("0"),
                        item.MaxPerBall.ToString("0"));
                }
                else
                {
                    numberGameRowVM = new BSNumberGameRowViewModel(
                        key.SportTypeId,
                        dctGameType[key],
                        key.BetTypeId,
                        dctGameType[key],
                        string.Empty,
                        string.Empty,
                        string.Empty,
                        string.Empty);
                }

                BSRows.Add(numberGameRowVM);
            }

            IsApplyExistingMemberChecked = false;
        }

        public IList<BSNumberGameRowViewModel> BSRows { get; set; }

        public BSNumberGameRowViewModel SportBetSetting { get; set; }
    }
}
