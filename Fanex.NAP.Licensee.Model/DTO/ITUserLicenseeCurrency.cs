namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class ITUserLicenseeCurrency
    {
        public OptionItem Licensee { get; set; }

        public IEnumerable<ITUserCurrency> Currencies { get; set; }
    }
}