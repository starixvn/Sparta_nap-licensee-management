namespace Fanex.NAP.Licensee.Model.Criteria.Vendor
{
    using Fanex.Data.Repository;

    public class VendorSearchingCriteria : CriteriaBase
    {
        public string VendorId { get; set; }

        public string SiteName { get; set; }
    }
}