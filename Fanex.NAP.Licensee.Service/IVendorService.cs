namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DTO;
    using Model.Criteria.Vendor;

    public interface IVendorService
    {
        IEnumerable<Vendor> GetVendorList(VendorSearchingCriteria criteria);

        Vendor GetVendorById(string vendorId);

        bool UpdateVendor(Vendor vendor);

        IEnumerable<string> GetFunctionKeyList();
    }
}