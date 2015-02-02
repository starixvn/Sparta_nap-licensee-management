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

        /// <summary>
        /// Gets product list.
        /// </summary>
        /// <value>A dictionary.</value>
        /// <returns>List of product types.</returns>
        public IList<ProductTypeItem> GetProductTypeList
        {
            get
            {
                IList<string> betPT = new List<string>() { "Bet setting", "PT" };
                IList<string> betComm = new List<string>() { "Bet setting", "Comm" };
                IList<string> pt = new List<string>() { "PT" };

                return new List<ProductTypeItem>()
                {
                    new ProductTypeItem(1, "Sportsbook", betPT),
                    new ProductTypeItem(161, "Number Game", betPT),
                    new ProductTypeItem(180, "Virtual Sports", betPT),
                    new ProductTypeItem(162, "Live Casino", betPT),
                    new ProductTypeItem(202, "Keno", pt), 
                    new ProductTypeItem(151, "Racing", betComm)
                };
            }
        }

        public IList<string> GetPositionTakingList
        {
            get
            {
                List<int> lstInts = Enumerable.Range(0, 1001).Where(n => n % 5 == 0).ToList();
                IList<string> lstPTs = new List<string>();
                lstInts.ForEach(n => lstPTs.Add((n / 1000f).ToString("0.###")));

                return lstPTs;
            }
        }

        public IList<string> GetCommList
        {
            get
            {
                List<int> lstInts = Enumerable.Range(0, 401).Where(n => n % 5 == 0).ToList();
                IList<string> lstPTs = new List<string>();
                lstInts.ForEach(n => lstPTs.Add((n / 1000f).ToString("0.###")));

                return lstPTs;
            }
        }

        /// <summary>
        /// Gets super licensee list.
        /// </summary>
        /// <param name="siteName">Site name.</param>
        /// <returns>List of licensee items.</returns>
        public IList<LicenseeItem> GetSuperLicenseeList(string siteName)
        {
            using (var db = new ObjectDb("NAP_LM_LicenseeSuperList"))
            {
                return db.Query<LicenseeItem>(new { Site = siteName }).ToList();
            }
        }
    }
}