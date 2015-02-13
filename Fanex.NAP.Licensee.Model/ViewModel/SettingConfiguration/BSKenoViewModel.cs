namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// Edit bet setting keno view model.
    /// </summary>
    public class BSKenoViewModel : BSBaseViewModel
    {
        public BSKenoViewModel()
        {
        }

        public BSKenoViewModel(IList<BSKenoItem> lstItems, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSCheckableRowViewModel>();

            foreach (var key in dctGameType.Keys)
            {
                BSCheckableRowViewModel kenoVm;
                BSKenoItem item = lstItems.Where(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId).FirstOrDefault();
                if (item != null)
                {
                    kenoVm = new BSCheckableRowViewModel(
                        key.SportTypeId,
                        dctGameType[key],
                        key.BetTypeId,
                        dctGameType[key],
                        ((int)item.MinBet).ToString(),
                        ((int)item.MaxBet).ToString(),
                        ((int)item.MaxPerMatch).ToString(),
                        !item.DisableSuper,
                        !item.DisableDownline,
                        true);
                }
                else
                {
                    kenoVm = new BSCheckableRowViewModel(
                        key.SportTypeId,
                        dctGameType[key],
                        key.BetTypeId,
                        dctGameType[key],
                        string.Empty,
                        string.Empty,
                        string.Empty,
                        false,
                        false,
                        true);
                }

                BSRows.Add(kenoVm);
            }

            IsApplyExistingMemberChecked = false;
        }

        public IList<BSCheckableRowViewModel> BSRows { get; set; }
    }
}
