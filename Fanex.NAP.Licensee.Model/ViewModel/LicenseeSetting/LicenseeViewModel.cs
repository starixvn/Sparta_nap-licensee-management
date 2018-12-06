namespace Fanex.NAP.Licensee.Model.ViewModel.LicenseeSetting
{
    using System.Collections.Generic;
    using DTO;

    public class LicenseeViewModel
    {
        public Licensee Licensee { get; set; }

        public IEnumerable<LicenseeProduct> ProductList { get; set; }
    }
}