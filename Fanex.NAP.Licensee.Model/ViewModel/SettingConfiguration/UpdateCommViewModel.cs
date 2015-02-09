namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Update commission view model.
    /// </summary>
    public class UpdateCommViewModel
    {
        public int CustId { get; set; }

        public IList<CommRowViewModel> CommRows { get; set; }
    }
}
