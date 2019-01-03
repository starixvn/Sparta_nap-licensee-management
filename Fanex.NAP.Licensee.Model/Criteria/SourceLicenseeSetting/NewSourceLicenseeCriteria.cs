namespace Fanex.NAP.Licensee.Model.Criteria.SourceLicenseeSetting
{
    using System;

    public class NewSourceLicenseeCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int LicenseeId { get; set; }

        public string LicenseeName { get; set; }

        public int SourceLicenseeId { get; set; }

        public string SourceLicenseeName { get; set; }

        public int CurrencyId { get; set; }

        public string Currency { get; set; }

        public int RoleId { get; set; }

        public bool IsAddAll { get; set; }

        public string SourceIdList { get; set; }

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            FromDate = FromDate,
            ToDate = ToDate,
            LicenseeId = LicenseeId,
            SourceLicenseeId = SourceLicenseeId,
            CurrencyId = CurrencyId,
            RoleId = RoleId,
            IsAddAll = IsAddAll,
            SourceIdList = SourceIdList,
            AffectedRow = 0
        };
    }
}