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

        IList<string> GetPositionTakingList { get; }

        IList<string> GetCommList { get; }

        IDictionary<BSKeyPair, string> GetSportbookGameTypeList { get; }

        IDictionary<BSKeyPair, string> GetNumberGameTypeList { get; }

        IDictionary<BSKeyPair, string> GetKenoGameTypeList { get; }

        IList<LicenseeItem> GetSuperLicenseeList(string siteName);

        IList<CurrencyItem> GetLicenseeCurrencyList(int licenseeId);
    }
}