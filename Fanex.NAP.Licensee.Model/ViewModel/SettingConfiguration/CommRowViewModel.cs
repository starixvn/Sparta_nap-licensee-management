namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Edit commission row view model.
    /// </summary>
    public class CommRowViewModel
    {
        public CommRowViewModel()
        {
        }

        public CommRowViewModel(
                int sportTypeId,
                string sportTypeName,
                int betTypeId,
                string betTypeName,
                bool isChecked,
                string selectedComm,
                IList<string> lstComms)
        {
            SportTypeId = sportTypeId;
            SportTypeName = sportTypeName;

            BetTypeId = betTypeId;
            BetTypeName = betTypeName;
            IsChecked = isChecked;

            SelectedComm = selectedComm;
            Comms = lstComms;

            IsDisabled = false;
            RowSpan = -1;
        }

        public int SportTypeId { get; set; }

        public string SportTypeName { get; set; }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public bool IsChecked { get; set; }

        public string SelectedComm { get; set; }

        public IList<string> Comms { get; set; }

        public bool IsDisabled { get; set; }

        public int RowSpan { get; set; }
    }
}
