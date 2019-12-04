using System;

namespace Fanex.NAP.Licensee.Model.DTO
{
    public class LAPVendorInfo
    {
        public string VendorID { get; set; }

        public int LicenseeType { get; set; }

        public string FunctionIgnore { get; set; }

        public static implicit operator LAPVendorInfo(LicenseeVendor v)
        {
            throw new NotImplementedException();
        }
    }
}