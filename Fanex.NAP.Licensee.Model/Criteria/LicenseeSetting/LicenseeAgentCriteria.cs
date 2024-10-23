namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    using Data.Repository;

    public class LicenseeAgentCriteria : CriteriaBase
    {
        public string LicenseeName { get; set; }

        public string SuperWildCard { get; set; }

        public bool IsSpecial { get; set; }

        public int Currency { get; set; }

        public int RedmineId { get; set; }

        public override string GetSettingKey()
        {
            return "Nap_LM_Licensee_AddAgent_New";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(LicenseeName) && Currency > 0;
        }

        public static string ToWildCard(string licenseeName)
        {
            return licenseeName + "Super";
        }
    }
}