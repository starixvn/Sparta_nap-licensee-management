namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Core;
    using Model.Criteria.Product;
    using Model.DTO;

    public class ManageProductService : IManageProductService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public ManageProductService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public ResultGridData<dynamic> Search(LicenseeProductMatrixCriteria criteria)
        {
            var result = new ResultGridData<dynamic>();

            using (var db = _objectDbGenerator.Create("Nap_LM_LicenseeProduct_Select"))
            {
                result.Data = db.Query<dynamic>(criteria);
            }

            result.TotalItem = criteria.TotalItem;

            return result;
        }

        public IEnumerable<Product> GetNewProductList(string licenseeList)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicenseeProduct_NewProduct_Select"))
            {
                return db.Query<Product>(new { LicenseeList = licenseeList });
            }
        }

        public IEnumerable<Product> GetRemoveProductList(string licenseeList)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicenseeProduct_RemoveProduct_Select"))
            {
                return db.Query<Product>(new { LicenseeList = licenseeList });
            }
        }
    }
}