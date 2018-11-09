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

        Licensee GetLicensee(int licenseeId);

        IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId);

        bool LaunchProduct(LaunchProductCriteria criteria);

        bool OfferProduct(OfferProductCriteria criteria);

        bool RemoveProduct(LicenseeProductCriteria criteria);
    }
}