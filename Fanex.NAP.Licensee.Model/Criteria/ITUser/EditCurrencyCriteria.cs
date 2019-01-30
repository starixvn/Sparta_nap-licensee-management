namespace Fanex.NAP.Licensee.Model.Criteria.ITUser
{
    using System.Collections.Generic;

    public class EditCurrencyCriteria
    {
        public string UserName { get; set; }

        public IEnumerable<LicenseeCurrencyCriteria> ActiveCurrencies { get; set; }

        public IEnumerable<LicenseeCurrencyCriteria> DeactiveCurrencies { get; set; }

        public int RedmineId { get; set; }
    }
}