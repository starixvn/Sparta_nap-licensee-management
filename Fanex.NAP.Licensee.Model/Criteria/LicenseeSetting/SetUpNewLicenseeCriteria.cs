namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    public class SetUpNewLicenseeCriteria
    {
        public string LicenseeName { get; set; }

        public string SuperWildCard { get; set; }

        public string LicenseeType { get; set; }

        public bool IsSpecial { get; set; }

        public string ProductCode { get; set; }

        public string SystemisActive { get; set; }

        public bool IsAllowMemberComm { get; set; }

        public bool IsPullService { get; set; }

        public bool IsAllowWLbyLeague { get; set; }
    }
}