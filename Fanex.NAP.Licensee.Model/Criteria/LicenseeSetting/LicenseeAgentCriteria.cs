namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    public class LicenseeAgentCriteria
    {
        public string LicenseeName { get; set; }

        public string SuperWildCard { get; set; }

        public bool IsSpecial { get; set; }

        public int Currency { get; set; }

        public int RedmineId { get; set; }
    }
}