// -----------------------------------------------------------------------
// <copyright file="CommonService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Caching;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class CommonService : ICommonService
    {
        private const string KENOGAMETYPECACHEKEY = "NAP_LICENSEE_MANAGEMENTKENOGAMETYPECACHEKEY";

        private ICache _cache = CacheService.CreateInstance(CacheType.MemoryCache);

        /// <summary>
        /// Gets licensee list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IList<LicenseeItem> GetLicenseeList
        {
            get
            {
                using (var db = new ObjectDb("Acc_Dep_LicenseeSelAll"))
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

        public IDictionary<int, string> GetKenoGameType
        {
            get
            {
                IDictionary<int, string> result = null;
                if (_cache.Contains(KENOGAMETYPECACHEKEY))
                {
                    result = _cache.Get<IDictionary<int, string>>(KENOGAMETYPECACHEKEY);
                }

                if (result == null)
                {
                    using (var db = new ObjectDb("NAP_SpecialCustSettingGameType_Sel"))
                    {
                        result = new Dictionary<int, string>();
                        using (var reader = db.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.Add(int.Parse(reader["GameTypeID"].ToString()), reader["GameTypeName"].ToString());
                            }
                        }

                        _cache.Set<IDictionary<int, string>>(KENOGAMETYPECACHEKEY, result);
                    }
                }

                return result;
            }
        }
    }
}