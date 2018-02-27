using System.ComponentModel.DataAnnotations;

namespace Fanex.NAP.Licensee.Model.DTO
{
    public class Vendor
    {
        public string VendorId { get; set; }

        public string SiteName { get; set; }

        public byte LicenseeType { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string InternalUrl { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string LrfUrl { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string AffiliateUrl { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = true)]
        public string Exclusions { get; set; }

        public bool IsTest { get; set; }

        public string SiteId { get; set; }

        public bool Disable { get; set; }
    }
}
