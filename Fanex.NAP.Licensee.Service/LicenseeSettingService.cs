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

        public ResultData<Licensee> SetUpNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            var licenseeId = 0;
            using (var db = _objectDbGenerator.Create("DBA_Lrf_CreateNewLicensee"))
            {
                licenseeId = db.QueryEntity<int>(criteria);
            }

            return new ResultData<Licensee>
            {
                IsSuccess = licenseeId > 0,
                Data = licenseeId > 0 ? GetLicensee(licenseeId) : null
            };
        }

        public Licensee GetLicensee(int licenseeId)
        {
            return Search(new LicenseeCriteria { LicenseeId = licenseeId }).FirstOrDefault();
        }

        public IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_GetOfferedProduct"))
            {
                return db.Query<LicenseeProduct>(new { LicenseeId = licenseeId });
            }
        }

        public bool LaunchProduct(LaunchProductCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_LaunchProduct"))
            {
                var isSuccess = db.QueryEntity<int>(criteria) == 1;

                return isSuccess;
            }
        }

        public bool OfferProduct(OfferProductCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_OfferProduct"))
            {
                var isSuccess = db.QueryEntity<int>(criteria) == 1;

                return isSuccess;
            }
        }

        public bool RemoveProduct(LicenseeProductCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_RemoveProduct"))
            {
                var isSuccess = db.QueryEntity<int>(criteria) == 1;

                return isSuccess;
            }
        }
    }
}