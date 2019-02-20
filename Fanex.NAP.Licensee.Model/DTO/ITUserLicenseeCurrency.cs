namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class ITUserLicenseeCurrency
    {
        public ITUserLicensee Licensee { get; set; }

        public IEnumerable<ITUserCurrency> Currencies { get; set; }
    }
}