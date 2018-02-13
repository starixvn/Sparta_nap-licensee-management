using System.Collections.Generic;
using Fanex.NAP.Licensee.Model.Criteria.Vendor;
using Fanex.NAP.Licensee.Model.DTO;
using Fanex.NAP.Licensee.Service.Core;

namespace Fanex.NAP.Licensee.Service
{
    public class VendorService : IVendorService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;

        public VendorService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public IEnumerable<Vendor> GetVendorList(VendorSearchingCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_Select"))
            {
                return db.Query<Vendor>(criteria.GetSpParams());
            }
        }

        public Vendor GetVendorById(string vendorId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_SelectById"))
            {
                return db.QueryEntity<Vendor>(new { vendorId });
            }
        }
    }
}
