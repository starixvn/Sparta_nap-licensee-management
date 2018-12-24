namespace Fanex.NAP.Licensee.Service
{
    using Model.Criteria.Product;
    using Model.DTO;

    public interface IManageProductService
    {
        ResultGridData<dynamic> Search(LicenseeProductMatrixCriteria criteria);
    }
}