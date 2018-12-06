namespace Fanex.NAP.Licensee.Model.ViewModel.LicenseeSetting
{
    using System.Collections.Generic;
    using DTO;

    public class NewLicenseeViewModel
    {
        public IEnumerable<Product> ProductList { get; set; }

        public IEnumerable<SystemItem> SystemList { get; set; }

        public IEnumerable<string> ResellerList { get; set; }

        public IEnumerable<SystemItem> SelectedSystem { get; set; }
    }
}