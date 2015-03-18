namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
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
            InitialBSRow(lstItems, dctGameType);

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

            IsEnableDisabled = IsEnableChecked == true ? true : false;
            IsDownlineDisabled = IsDownlineChecked == true ? true : false;
            IsApplyExistingMemberChecked = false;
        }

        public bool IsEnableChecked { get; set; }

        public bool IsEnableDisabled { get; set; }

        public bool IsDownlineChecked { get; set; }

        public bool IsDownlineDisabled { get; set; }

        public BSCheckableRowViewModel SportBetSetting { get; set; }

        public IList<BSCheckableRowViewModel> BSRows { get; set; }

        /// <summary>
        /// Bet setting.
        /// </summary>
        /// <param name="lstItems">List Keno Item.</param>
        /// <param name="dctGameType">Dictionary Game Type.</param>
        private void InitialBSRow(IList<BSKenoItem> lstItems, IDictionary<BSKeyPair, string> dctGameType)
        {
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
                        item.MinBet.ToString("0"),
                        item.MaxBet.ToString("0"),
                        item.MaxPerMatch.ToString("0"),
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
        }
    }
}
