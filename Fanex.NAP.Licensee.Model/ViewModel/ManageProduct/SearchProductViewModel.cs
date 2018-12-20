namespace Fanex.NAP.Licensee.Model.ViewModel.ManageProduct
{
    using System.Collections.Generic;
    using DTO;

    public class SearchProductViewModel
    {
        public IEnumerable<LicenseeItem> LicenseeList { get; set; }

        public IEnumerable<Product> ProductList { get; set; }
    }
}