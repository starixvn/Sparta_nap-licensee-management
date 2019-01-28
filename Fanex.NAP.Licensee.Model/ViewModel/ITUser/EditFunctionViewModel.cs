namespace Fanex.NAP.Licensee.Model.ViewModel.ITUser
{
    using System.Collections.Generic;
    using DTO;

    public class EditFunctionViewModel
    {
        public string UserName { get; set; }

        public IEnumerable<OptionItem> LicenseeList { get; set; }

        public IEnumerable<OptionItem> FunctionList { get; set; }
    }
}