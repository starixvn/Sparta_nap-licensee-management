namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// Bet setting racing view model.
    /// </summary>
    public class BSRacingViewModel : BSBaseViewModel
    {
        public BSRacingViewModel()
        {
        }

        public BSRacingViewModel(IList<BSRacingItem> lstBetSettingItems, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSCheckableRowViewModel>();
            foreach (BSRacingItem item in lstBetSettingItems)
            {
                BSCheckableRowViewModel kenoVm = new BSCheckableRowViewModel(
                    item.SportTypeId,
                    dctGameType[dctGameType.Keys.First(k => k.SportTypeId == item.SportTypeId && k.BetTypeId == item.BetTypeId)].Split(';')[0],
                    item.BetTypeId,
                    dctGameType[dctGameType.Keys.First(k => k.SportTypeId == item.SportTypeId && k.BetTypeId == item.BetTypeId)].Split(';')[1],
                    item.MinBet,
                    item.MaxBet,
                    item.MaxPerMatch,
                    !item.DisableSuper,
                    !item.DisableDownline,
                    false);

                BSRows.Add(kenoVm);
            }

            IsApplyExistingMemberChecked = false;

            BuildRowSpan();
        }

        public IList<BSCheckableRowViewModel> BSRows { get; set; }

        /// <summary>
        /// Compute row span.
        /// </summary>
        private void BuildRowSpan()
        {
            // Sort
            BSRows = BSRows.OrderBy(n => n.SportTypeId).ThenBy(n => n.BetTypeId).ToList();

            List<int> lstSpans = BSRows.GroupBy(n => n.SportTypeId, (key, g) => g.Count()).ToList();

            // Get first of group
            var lstFirsts = BSRows.GroupBy(x => x.SportTypeId, (key, g) => g.First()).ToList();

            for (int i = 0; i < lstFirsts.Count; i++)
            {
                lstFirsts[i].RowSpan = lstSpans[i];
            }
        }
    }
}
