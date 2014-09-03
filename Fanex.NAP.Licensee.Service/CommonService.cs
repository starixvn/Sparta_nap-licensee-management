// -----------------------------------------------------------------------
// <copyright file="CommonService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class CommonService : ICommonService
    {
        /// <summary>
        /// Gets licensee list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IList<LicenseeItem> GetLicenseeList
        {
            get
            {
                using (var db = new ObjectDb("NAP_SpecialCustSetting_LicenseeList"))
                {
                    return db.Query<LicenseeItem>().ToList();
                }
            }
        }

        /// <summary>
        /// Gets currency list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IList<CurrencyItem> GetCurrencyList
        {
            get
            {
                using (var db = new ObjectDb("NAP_SpecialCustSetting_CurrencyList"))
                {
                    return db.Query<CurrencyItem>().ToList();
                }
            }
        }
    }
}