namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    public interface ICommonService
    {
        IList<LicenseeItem> GetLicenseeList { get; }

        IList<CurrencyItem> GetCurrencyList { get; }

        IDictionary<int, string> GetKenoGameType { get; }

        IList<ProductTypeItem> GetProductTypeList { get; }

        IList<string> GetCommList { get; }

        IDictionary<BSKeyPair, string> GetSportsbookGameTypeList { get; }

        IList<SuperLicenseeAndCurrencyItem> GetSuperLicenseeList(string siteName);

        IList<CurrencyItem> GetLicenseeCurrencyList(int licenseeId);

        IList<LicenseeAgent> GetLicenseeAgentList(int SRecommend);
    }
}