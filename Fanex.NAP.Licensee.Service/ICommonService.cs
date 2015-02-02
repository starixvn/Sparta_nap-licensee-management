// -----------------------------------------------------------------------
// <copyright file="ICommonService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DTO;

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

        IList<LicenseeItem> GetSuperLicenseeList(string siteName);
    }
}