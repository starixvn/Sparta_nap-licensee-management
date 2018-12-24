namespace Fanex.NAP.Licensee.Service
{
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
    }
}