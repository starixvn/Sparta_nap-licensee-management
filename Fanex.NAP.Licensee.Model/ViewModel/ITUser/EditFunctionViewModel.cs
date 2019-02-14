namespace Fanex.NAP.Licensee.Model.ViewModel.ITUser
{
    using System.Collections.Generic;
    using DTO;

    public class EditFunctionViewModel
    {
        public ITUser User { get; set; }

        public IEnumerable<ITUserLicensee> LicenseeList { get; set; }

        public IEnumerable<OptionItem> FunctionList { get; set; }
    }
}