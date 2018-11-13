namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    public class LicenseeCriteria
    {
        public LicenseeCriteria ()
        {
            IsAll = true;
        }

        public string LicenseeName { get; set; }

        public bool IsActive { get; set; }

        public bool IsLaunched { get; set; }

        public bool IsAll { get; set; }
    }
}
