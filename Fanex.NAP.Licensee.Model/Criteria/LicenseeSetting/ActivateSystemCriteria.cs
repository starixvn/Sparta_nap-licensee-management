namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    public class ActivateSystemCriteria
    {
        public string LicenseeName { get; set; }

        public string SystemName { get; set; }

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            LicenseeName = LicenseeName,
            SystemName = SystemName
        };
    }
}