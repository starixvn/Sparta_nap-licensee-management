namespace Fanex.NAP.Licensee.Model.DTO
{
    public class ITUserCurrency
    {
        public int LicenseeId { get; set; }

        public string LicenseeName { get; set; }

        public int CurrencyId { get; set; }

        public string CurrencyName { get; set; }

        public int IsAssigned { get; set; }
    }
}