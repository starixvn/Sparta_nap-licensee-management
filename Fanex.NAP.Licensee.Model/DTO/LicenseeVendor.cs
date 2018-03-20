namespace Fanex.NAP.Licensee.Model.DTO
{
    public class LicenseeVendor
    {
        public string VendorId { get; set; }

        public string SiteName { get; set; }

        public byte LicenseeType { get; set; }

        public string PortalUrl { get; set; }

        public string InternalUrl { get; set; }

        public string LrfUrl { get; set; }

        public string AffiliateUrl { get; set; }

        public string Exclusions { get; set; }

        public bool IsTest { get; set; }

        public string SiteId { get; set; }

        public bool Disable { get; set; }
    }
}
