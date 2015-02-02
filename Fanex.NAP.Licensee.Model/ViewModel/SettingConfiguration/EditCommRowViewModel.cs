namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Edit commission row view model.
    /// </summary>
    public class EditCommRowViewModel
    {
        public int SportTypeId { get; set; }

        public string SportTypeName { get; set; }

        public int BetTypeId { get; set; }

        public string BetTypeName { get; set; }

        public bool IsChecked { get; set; }

        public string SelectedComm { get; set; }

        public IList<string> Comms { get; set; }
    }
}
