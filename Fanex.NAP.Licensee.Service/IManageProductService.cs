namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Dynamic;
    using Model.Criteria.Product;

    public interface IManageProductService
    {
        IEnumerable<object> Search(LicenseeProductMatrixCriteria criteria);
    }
}