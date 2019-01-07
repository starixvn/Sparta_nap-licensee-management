namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.Product;
    using Model.DTO;

    public interface IManageProductService
    {
        ResultGridData<dynamic> Search(LicenseeProductMatrixCriteria criteria);

        IEnumerable<Product> GetNewProductList(string licenseeList);

        IEnumerable<Product> GetRemoveProductList(string licenseeList);
    }
}