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

        ResultData<Licensee> SetUpNewLicensee(SetUpNewLicenseeCriteria criteria, int userId);

        Licensee GetLicensee(string licenseeName);

        IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId);

        string OfferProduct(OfferProductCriteria criteria, int userId);

        string RemoveProduct(RemoveLicenseeProductCriteria criteria, string pullServiceKey, int userId);

        IEnumerable<string> GetLrfFucntionKey(int licenseeId);

        int AddAgent(LicenseeAgentCriteria criteria, int userId);

        ResultData<Licensee> TerminateLicensee(string licenseeName, int userId);

        string EnablePullService(LicenseeProductCriteria criteria, string settingName, int userId);

        IEnumerable<CurrencyItem> GetSuperCurrency(string superWildCard);

        IEnumerable<string> GetIntegrateSetting(int licenseeId);
    }
}