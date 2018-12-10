namespace Fanex.NAP.Licensee.Model.Criteria.SourceLicenseeSetting
{
    using System;

    public class SearchSourceLicenseeCriteria : PageModel
    {
        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public int LicenseeId { get; set; }

        public int SourceLicenseeId { get; set; }

        public int CurrencyId { get; set; }

        public int RoleId { get; set; }
    }
}