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
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Insert"))
            {
                db.ExecuteNonQuery(criteria);
            }

            var licensee = GetLicensee(criteria.LicenseeName);

            return new ResultData<Licensee>
            {
                IsSuccess = licensee != null,
                Data = licensee
            };
        }

        public Licensee GetLicensee(string licenseeName)
        {
            return Search(new LicenseeCriteria { LicenseeName = licenseeName, IsAll = false }).FirstOrDefault();
        }

        public IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_GetOfferedProduct"))
            {
                return db.Query<LicenseeProduct>(new { licenseeId = licenseeId });
            }
        }

        public void LaunchProduct(LaunchProductCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_LaunchProduct"))
            {
                db.ExecuteNonQuery(criteria);
            }
        }

        public void OfferProduct(OfferProductCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_OfferProduct"))
            {
                db.ExecuteNonQuery(criteria);
            }
        }

        public void RemoveProduct(LicenseeProductCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_RemoveProduct"))
            {
                db.ExecuteNonQuery(criteria);
            }
        }
    }
}