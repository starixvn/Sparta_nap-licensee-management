namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// Edit commission view model.
    /// </summary>
    public class EditCommViewModel
    {
        private IDictionary<int, string> _dctSportType = new Dictionary<int, string>() { { 151, "Racing" }, { 152, "Greyhounds" }, { 153, "Harness" } };

        private IDictionary<int, string> _dctBetType = new Dictionary<int, string>() { { 31, "UK/Irish Tote" }, { 41, "SA Tote" }, { 51, "Aust Tote" } };

        public EditCommViewModel(IList<CommItem> lstCommItems, IList<string> lstComms)
        {
            EditCommRows = new List<EditCommRowViewModel>();

            EditCommRowViewModel racingUK = new EditCommRowViewModel(151, _dctSportType[151], 31, _dctBetType[31], false, "0.04", lstComms);
            EditCommRows.Add(racingUK);

            EditCommRowViewModel racingSA = new EditCommRowViewModel(151, _dctSportType[151], 41, _dctBetType[41], false, "0.04", lstComms);
            EditCommRows.Add(racingSA);

            EditCommRowViewModel racingAust = new EditCommRowViewModel(151, _dctSportType[151], 51, _dctBetType[51], false, "0.04", lstComms);
            EditCommRows.Add(racingAust);

            EditCommRowViewModel greyhoundsUK = new EditCommRowViewModel(152, _dctSportType[152], 41, _dctBetType[31], false, "0.04", lstComms);
            EditCommRows.Add(greyhoundsUK);

            EditCommRowViewModel greyhoundsAust = new EditCommRowViewModel(152, _dctSportType[152], 51, _dctBetType[41], false, "0.04", lstComms);
            EditCommRows.Add(greyhoundsAust);

            EditCommRowViewModel harnessAust = new EditCommRowViewModel(153, _dctSportType[153], 51, _dctBetType[31], false, "0.04", lstComms);
            EditCommRows.Add(harnessAust);

            // Bind data
            foreach (CommItem item in lstCommItems)
            {
                EditCommRowViewModel curEditCommRow = EditCommRows.Where(n => n.SportTypeId == item.SportType && n.BetTypeId == item.BetType).FirstOrDefault();
                if (curEditCommRow != null)
                {
                    // Remove 
                    EditCommRows.Remove(curEditCommRow);

                    // Add new
                    string strCommValue = item.SDiscount.ToString("0.###");
                    EditCommRowViewModel newEditCommRow = new
                        EditCommRowViewModel(item.SportType, _dctSportType[item.SportType], item.BetType, _dctBetType[item.BetType], false, strCommValue, lstComms);
                    EditCommRows.Add(newEditCommRow);
                }
                else
                {
                    // TODO: Create AppEx
                    // throw new Exception("Unsupported SportType or BetType!");
                }
            }

            BuildRowSpan();
        }

        public IList<EditCommRowViewModel> EditCommRows { get; set; }

        public EditCommRowViewModel RacingUK { get; set; }

        public EditCommRowViewModel RacingSA { get; set; }

        public EditCommRowViewModel RacingAust { get; set; }

        public EditCommRowViewModel GreyhoundsUK { get; set; }

        public EditCommRowViewModel GreyhoundsAust { get; set; }

        public EditCommRowViewModel HarnessAust { get; set; }

        /// <summary>
        /// Compute row span.
        /// </summary>
        private void BuildRowSpan()
        {
            // Sort
            EditCommRows = EditCommRows.OrderBy(n => n.SportTypeId).ThenBy(n => n.BetTypeId).ToList();

            List<int> lstSpans = EditCommRows.GroupBy(n => n.SportTypeId, (key, g) => g.Count()).ToList();

            // Get first of group
            var lstFirsts = EditCommRows.GroupBy(x => x.SportTypeId, (key, g) => g.First()).ToList();

            for (int i = 0; i < lstFirsts.Count; i++)
            {
                lstFirsts[i].RowSpan = lstSpans[i];
            }
        }
    }
}
