namespace Fanex.NAP.Licensee.Model.ViewModel.ITUser
{
    using System.Collections.Generic;
    using DTO;

    public class AddUserViewModel
    {
        public string Token { get; set; }

        public IEnumerable<OptionItem> LicenseeList { get; set; }
    }
}