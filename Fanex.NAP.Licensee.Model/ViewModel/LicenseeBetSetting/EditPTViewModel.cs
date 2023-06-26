namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Edit PT view model.
    /// </summary>
    public class EditPTViewModel
    {
        public string ProductName { get; set; }

        public IList<string> PositionTakings { get; set; }

        public string SelectedPositionTaking { get; set; }
    }
}
