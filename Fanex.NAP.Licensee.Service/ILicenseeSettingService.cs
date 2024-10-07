namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.LicenseeSetting;
    using Model.DTO;

    public interface ILicenseeSettingService
    {
        ResultGridData<Licensee> Search(LicenseeCriteria criteria);

        IEnumerable<LicenseeItem> GetLicenseeList(bool isAll = false);

        IEnumerable<Product> GetProductList();

        IEnumerable<SystemItem> GetSystemList();

        ResultData<Licensee> SetUpNewLicensee(SetUpNewLicenseeCriteria criteria);

        Licensee GetLicensee(string licenseeName);

        IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId);

        string OfferProduct(OfferProductCriteria criteria);

        string RemoveProduct(RemoveLicenseeProductCriteria criteria);

        IEnumerable<string> GetLrfFucntionKey(int licenseeId);

        ResultData<(int AffectedRows, int LicenseeIdAffected)> AddAgent(LicenseeAgentCriteria criteria);

        ResultData<Licensee> TerminateLicensee(TerminateLicenseeCriteria criteria);

        string EnablePullService(LicenseeProductCriteria criteria, string settingName);

        IEnumerable<CurrencyItem> GetSuperCurrency(string superWildCard);

        IEnumerable<string> GetIntegrateSetting(int licenseeId);

        IEnumerable<SystemItem> GetLicenseeSystemList(int licenseeId);

        string ActivateSystem(ActivateSystemCriteria criteria);
    }
}