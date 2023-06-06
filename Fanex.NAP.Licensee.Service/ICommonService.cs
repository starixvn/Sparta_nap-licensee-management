namespace Fanex.NAP.Licensee.Service
{
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.LicenseeBetSetting;
    using System.Collections.Generic;

    public interface ICommonService
    {
        IList<LicenseeItem> GetLicenseeList { get; }

        IList<CurrencyItem> GetCurrencyList { get; }

        IDictionary<int, string> GetKenoGameType { get; }

        IList<ProductTypeItem> GetProductTypeList { get; }

        IList<string> GetCommList { get; }

        IDictionary<BSKeyPair, string> GetSportsbookGameTypeList { get; }

        IDictionary<BSKeyPair, string> GetGameTypeList { get; }

        IList<SuperLicenseeAndCurrencyItem> GetSuperLicenseeList(string siteName);

        IList<CurrencyItem> GetLicenseeCurrencyList(int licenseeId);

        IList<LicenseeAgent> GetLicenseeAgentList(int SRecommend);
    }
}