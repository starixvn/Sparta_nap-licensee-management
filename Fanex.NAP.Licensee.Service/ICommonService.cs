// -----------------------------------------------------------------------
// <copyright file="ICommonService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
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

        IDictionary<BSKeyPair, string> GetVirtualSportGameTypeList { get; }

        IDictionary<BSKeyPair, string> GetKenoGameTypeList { get; }

        IDictionary<BSKeyPair, string> GetRacingGameTypeList { get; }

        IList<LicenseeItem> GetSuperLicenseeList(string siteName);
    }
}