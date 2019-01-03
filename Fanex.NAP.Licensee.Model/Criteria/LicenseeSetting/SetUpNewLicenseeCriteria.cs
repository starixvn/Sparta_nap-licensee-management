namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    using System;

    public class SetUpNewLicenseeCriteria
    {
        public string LicenseeName { get; set; }

        public string SuperWildCard { get; set; }

        public string LicenseeType { get; set; }

        public bool IsSpecial { get; set; }

        public string ProductCode { get; set; }

        public string SystemIsActive { get; set; }

        public bool IsAllowMemberComm { get; set; }

        public DateTime EffectiveDate { get; set; }

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            LicenseeName = LicenseeName,
            SuperWildCard = SuperWildCard,
            LicenseeType = LicenseeType,
            IsSpecial = IsSpecial,
            ProductCode = ProductCode,
            SystemIsActive = SystemIsActive,
            IsAllowMemberComm = IsAllowMemberComm,
            EffectiveDate = EffectiveDate
        };
    }
}