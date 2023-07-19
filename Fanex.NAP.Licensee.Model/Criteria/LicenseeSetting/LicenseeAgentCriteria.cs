using Fanex.Data.Repository;

namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    public class LicenseeAgentCriteria : CriteriaBase
    {
        public string LicenseeName { get; set; }

        public string SuperWildCard { get; set; }

        public bool IsSpecial { get; set; }

        public int Currency { get; set; }

        public int RedmineId { get; set; }

        public override string GetSettingKey()
        {
            return "Nap_LM_Licensee_AddAgent";
        }

        public override bool IsValid()
        {
            return true;
        }

        public static string ToWildCard(string licenseeName)
        {
            return licenseeName + "Super";
        }
    }
}
