namespace Fanex.NAP.Licensee.Model.Criteria.Vendor
{
    using Fanex.Data.Repository;

    public class VendorSearchingCriteria : PageModel
    {
        public string VendorId { get; set; }

        public string SiteName { get; set; }

        public string FunctionKey { get; set; }

        public bool Disable { get; set; }
    }
}