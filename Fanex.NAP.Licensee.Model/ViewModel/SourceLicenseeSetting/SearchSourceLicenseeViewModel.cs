namespace Fanex.NAP.Licensee.Model.ViewModel.ManageOperator
{
    using System.Collections.Generic;
    using DTO;

    public class SearchSourceLicenseeViewModel
    {
        public IEnumerable<CurrencyItem> CurrencyList { get; set; }

        public IEnumerable<LicenseeItem> SiteNameList { get; set; }

        public IDictionary<int, string> RoleList { get; set; }
    }
}