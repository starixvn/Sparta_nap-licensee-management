namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Update commission result view model.
    /// </summary>
    public class UpdateCommResultViewModel
    {
        public UpdateCommResultViewModel(string sportTypeName, string betTypeName, bool isOk, string message)
        {
            SportTypeName = sportTypeName;
            BetTypeName = betTypeName;
            IsOk = isOk;
            Message = message;
        }

        public string SportTypeName { get; set; }

        public string BetTypeName { get; set; }

        public bool IsOk { get; set; }

        public string Message { get; set; }
    }
}
