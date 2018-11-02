namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Core;
    using Model.Criteria.LicenseeSetting;
    using Model.DTO;

    public class LicenseeSettingService : ILicenseeSettingService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;

        public LicenseeSettingService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public IEnumerable<Licensee> Search(LicenseeCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Select"))
            {
                return db.Query<Licensee>(criteria);
            }
        }

        public IEnumerable<Product> GetProductList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Product_Select"))
            {
                return db.Query<Product>();
            }
        }

        public IEnumerable<SystemItem> GetSystemList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_System_Select"))
            {
                return db.Query<SystemItem>();
            }
        }

        public Licensee SetUpNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            var licenseeId = 0;
            using (var db = _objectDbGenerator.Create("DBA_Lrf_CreateNewLicensee"))
            {
                licenseeId = db.QueryEntity<int>(criteria);
            }

            return GetLicensee(licenseeId);
        }

        public Licensee GetLicensee(int licenseeId)
        {
            return Search(new LicenseeCriteria { LicenseeId = licenseeId }).FirstOrDefault();
        }

        public IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_OfferedProduct"))
            {
                return db.Query<LicenseeProduct>(new { LicenseeId = licenseeId });
            }
        }
    }
}