namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Update PT view model.
    /// </summary>
    public class UpdatePTViewModel
    {
        public int CustId { get; set; }

        public int ProductId { get; set; }

        public float PTValue { get; set; }
    }
}
