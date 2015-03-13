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

        public BSRacingViewModel(IList<BSRacingItem> lstItems, IDictionary<BSKeyPair, string> dctGameType)
        {
            // Bind data
            BSRows = new List<BSCheckableRowViewModel>();

            foreach (var key in dctGameType.Keys)
            {
                BSCheckableRowViewModel kenoVm;
                BSRacingItem item = lstItems.Where(i => i.SportTypeId == key.SportTypeId && i.BetTypeId == key.BetTypeId).FirstOrDefault();
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
                        false);
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
                        false);
                }

                BSRows.Add(kenoVm);
            }

            IsApplyExistingMemberChecked = false;

            BuildRowSpan();
        }

        public IList<BSCheckableRowViewModel> BSRows { get; set; }

        public BSCheckableRowViewModel SportBetSetting { get; set; }

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
