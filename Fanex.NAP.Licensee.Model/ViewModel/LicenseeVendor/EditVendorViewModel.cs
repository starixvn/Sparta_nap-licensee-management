namespace Fanex.NAP.Licensee.Model.ViewModel.LicenseeVendor
{
    using System.Collections.Generic;
    using DTO;

    public class EditVendorViewModel
    {
        public LicenseeVendor VendorInfo { get; set; }

        public IEnumerable<string> FunctionKeyList { get; set; }
    }
}