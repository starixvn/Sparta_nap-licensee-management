namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// Edit commission view model.
    /// </summary>
    public class CommViewModel
    {
        private const string defaultCommValue = "0.04";
        private static IDictionary<int, string> _dctSportType = new Dictionary<int, string>() { { 151, "Racing" }, { 152, "Greyhounds" }, { 153, "Harness" } };

        private static IDictionary<int, string> _dctBetType = new Dictionary<int, string>() { { 31, "UK/Irish Tote" }, { 41, "SA Tote" }, { 51, "Aust Tote" } };

        private IList<CommRowViewModel> _commRowVieModel = null;
        private IList<CommItem> _lstCommItems;
        private IList<string> _lstComms;

        public CommViewModel(IList<CommItem> lstCommItems, IList<string> lstComms)
        {
            this._lstCommItems = lstCommItems;
            this._lstComms = lstComms;
        }

        public IList<CommRowViewModel> EditCommRows
        {
            get
            {
                if (this._commRowVieModel == null)
                {
                    this.InitilizeCommRows();
                }
                return this._commRowVieModel;

            }
        }

        /// <summary>
        /// Compute row span.
        /// </summary>
        private void InitilizeCommRows()
        {
            this._commRowVieModel = new List<CommRowViewModel>()
            {
                new CommRowViewModel(151, _dctSportType[151], 31, _dctBetType[31], false, defaultCommValue, this._lstComms),
                new CommRowViewModel(151, _dctSportType[151], 41, _dctBetType[41], false, defaultCommValue, this._lstComms),
                new CommRowViewModel(151, _dctSportType[151], 51, _dctBetType[51], false, defaultCommValue, this._lstComms),
                new CommRowViewModel(152, _dctSportType[152], 41, _dctBetType[31], false, defaultCommValue, this._lstComms),
                new CommRowViewModel(152, _dctSportType[152], 51, _dctBetType[41], false, defaultCommValue, this._lstComms),
                new CommRowViewModel(153, _dctSportType[153], 51, _dctBetType[31], false, defaultCommValue, this._lstComms)

            };

            // Bind data
            foreach (CommItem item in this._lstCommItems)
            {
                CommRowViewModel curEditCommRow = EditCommRows.Where(n => n.SportTypeId == item.SportType && n.BetTypeId == item.BetType).FirstOrDefault();
                if (curEditCommRow != null)
                {
                    // Remove
                    this._commRowVieModel.Remove(curEditCommRow);

                    this._commRowVieModel.Add(new
                        CommRowViewModel(item.SportType, _dctSportType[item.SportType], item.BetType, _dctBetType[item.BetType], false, item.SDiscount.ToString("0.###"), this._lstComms));
                }
            }

            // Sort
            this._commRowVieModel = this._commRowVieModel.OrderBy(n => n.SportTypeId).ThenBy(n => n.BetTypeId).ToList();

            var lstSpans = this._commRowVieModel.GroupBy(n => n.SportTypeId, (key, g) => g.Count()).ToList();

            // Get first of group
            var lstFirsts = this._commRowVieModel.GroupBy(x => x.SportTypeId, (key, g) => g.First()).ToList();

            for (int i = 0; i < lstFirsts.Count; i++)
            {
                lstFirsts[i].RowSpan = lstSpans[i];
            }


        }
    }
}