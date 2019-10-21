namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DTO;
    using Model.Criteria.Vendor;

    public interface ILicenseeVendorService
    {
        ResultGridData<LicenseeVendor> GetVendorList(VendorSearchingCriteria criteria);

        LicenseeVendor GetVendorById(string vendorId);

        bool UpdateVendor(LicenseeVendor vendor);

        IEnumerable<string> GetFunctionKeyList();

        ResultData<string> UpdateUserPWA(VendorUserCriteria user);

        UserInfo GetUserBySiteNameAndUserID(string siteName, string userID);
    }
}