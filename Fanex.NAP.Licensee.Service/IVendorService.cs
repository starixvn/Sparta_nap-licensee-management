namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DTO;

    public interface IVendorService
    {
        IEnumerable<Vendor> GetVendorList();
    }
}