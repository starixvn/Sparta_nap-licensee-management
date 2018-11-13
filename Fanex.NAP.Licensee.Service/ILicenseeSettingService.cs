namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.LicenseeSetting;
    using Model.DTO;

    public interface ILicenseeSettingService
    {
        IEnumerable<Licensee> Search(LicenseeCriteria criteria);

        IEnumerable<Product> GetProductList();

        IEnumerable<SystemItem> GetSystemList();

        ResultData<Licensee> SetUpNewLicensee(SetUpNewLicenseeCriteria criteria);

        Licensee GetLicensee(string licenseeName);

        IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId);

        void LaunchProduct(LaunchProductCriteria criteria);

        void OfferProduct(OfferProductCriteria criteria);

        void RemoveProduct(LicenseeProductCriteria criteria);
    }
}