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

        public BSKenoViewModel(IList<BSKenoItem> lstBetSettingItems, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSCheckableRowViewModel>();
            foreach (BSKenoItem item in lstBetSettingItems)
            {
                BSCheckableRowViewModel kenoVm = new BSCheckableRowViewModel(
                    item.SportTypeId,
                    dctGameType[dctGameType.Keys.First(k => k.SportTypeId == item.SportTypeId && k.BetTypeId == item.BetTypeId)],
                    item.BetTypeId,
                    dctGameType[dctGameType.Keys.First(k => k.SportTypeId == item.SportTypeId && k.BetTypeId == item.BetTypeId)],
                    item.MinBet,
                    item.MaxBet,
                    item.MaxPerMatch,
                    !item.DisableSuper,
                    !item.DisableDownline,
                    false);

                BSRows.Add(kenoVm);
            }

            IsApplyExistingMemberChecked = false;
        }

        public IList<BSCheckableRowViewModel> BSRows { get; set; }
    }
}
