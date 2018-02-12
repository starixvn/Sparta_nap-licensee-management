using System.Collections.Generic;
using Fanex.NAP.Licensee.Model.DTO;

namespace Fanex.NAP.Licensee.Service
{
    public class VendorService : IVendorService
    {
        public IEnumerable<Vendor> GetVendorList()
        {
            return new List<Vendor>
            {
                new Vendor
                {
                    VendorId = "12bet",
                    SiteName = "12bet",
                    LicenseeType = 0,
                    InternalUrl = "http://admin.1bet.com/",
                    LrfUrl = "http://ha.nexdev.net:7610/LRF3",
                    AffiliateUrl = "http://affadmin.aoncash.com",
                    Exclusions = "[\"PlaytechCasinoWinLoss61\"]",
                    IsTest = false,
                    SiteId = "4200100",
                    Disable = true
                },
                new Vendor
                {
                    VendorId = "12betX",
                    SiteName = "12betX",
                    LicenseeType = 0,
                    InternalUrl = "http://admin.1bet.com/",
                    LrfUrl = "http://ha.nexdev.net:7610/LRF3",
                    AffiliateUrl = "http://affadmin.aoncash.com",
                    Exclusions = "[\"PlaytechCasinoWinLoss61\"]",
                    IsTest = false,
                    SiteId = "4200100",
                    Disable = true
                }
            };
        }
    }
}
