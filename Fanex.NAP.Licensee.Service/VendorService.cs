using System.Collections.Generic;
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

        public IEnumerable<Vendor> GetVendorList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_Select"))
            {
                return db.Query<Vendor>();
            }
        }
    }
}
