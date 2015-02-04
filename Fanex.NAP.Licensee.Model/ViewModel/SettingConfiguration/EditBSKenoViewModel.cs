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
    public class EditBSKenoViewModel
    {
        private IDictionary<int, string> _dctBetTypeName = new Dictionary<int, string>()
        {          
            { 1501, "Australia Acttab" },
            { 1503, "Slovakia Eklub" },
            { 1504, "Canada Keno" },
            { 1505, "West Canada Keno" },
            { 1507, "Massac" },
            { 1508, "Ohio" },
            { 1509, "Malta" },
            { 1511, "Kentucky" },
            { 1513, "Michigan" },
        };

        public EditBSKenoViewModel(IList<BetSettingKenoItem> lstBetSettingItems)
        {
            // Default data: 9 row

            // Bind data
            EditBSKenoRows = new List<EditBSKenoRowViewModel>();
            foreach (BetSettingKenoItem item in lstBetSettingItems)
            {
                EditBSKenoRowViewModel kenoVm = new EditBSKenoRowViewModel(
                    item.IBCBetTypeID,
                    _dctBetTypeName[item.IBCBetTypeID],
                    item.MinBet,
                    item.MaxBet,
                    item.MaxPerGameType,
                    item.IsDisabled,
                    item.DisableDowlinesKeno);

                EditBSKenoRows.Add(kenoVm);
            }
        }

        public IList<EditBSKenoRowViewModel> EditBSKenoRows { get; set; }
    }
}
