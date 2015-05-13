namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Update bet setting keno view model.
    /// </summary>
    public class UpdateBSResultViewModel
    {
        public UpdateBSResultViewModel(string sportOrBetTypeName, bool isOk, string message)
        {
            SportOrBetTypeName = sportOrBetTypeName;
            IsOk = isOk;
            Message = message;
        }

        public string SportOrBetTypeName { get; set; }

        public bool IsOk { get; set; }

        public string Message { get; set; }
    }
}
