namespace Fanex.NAP.Licensee.Model.ViewModel.ManageOperator
{
    using System.Collections.Generic;
    using DTO;

    public class ManageOperatorViewModel
    {
        public IEnumerable<CurrencyItem> CurrencyList { get; set; }

        public IEnumerable<string> SiteNameList { get; set; }
    }
}