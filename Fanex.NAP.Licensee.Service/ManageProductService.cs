namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Dynamic;
    using System.Linq;
    using Core;
    using Model.Criteria.Product;

    public class ManageProductService : IManageProductService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public ManageProductService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public IEnumerable<object> Search(LicenseeProductMatrixCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicenseeProduct_Select"))
            {
                return db.Query<object>(criteria);
            }
        }
    }
}