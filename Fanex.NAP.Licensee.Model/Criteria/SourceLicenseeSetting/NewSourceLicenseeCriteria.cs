namespace Fanex.NAP.Licensee.Model.Criteria.SourceLicenseeSetting
{
    using System;

    public class NewSourceLicenseeCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LicenseeId { get; set; }

        public int SourceLicenseeId { get; set; }

        public int CurrencyId { get; set; }

        public int RoleId { get; set; }

        public bool IsAddAll { get; set; }

        public string SourceIdList { get; set; }

        public int AffectedRow { get; set; } = 0;
    }
}