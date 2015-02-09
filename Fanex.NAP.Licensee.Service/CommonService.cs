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
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

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
                    new ProductTypeItem(202, "Keno", betPT),
                    new ProductTypeItem(162, "Live casino", pt), 
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
        /// Gets sport book game type list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IDictionary<BSKeyPair, string> GetSportbookGameTypeList
        {
            get
            {
                IDictionary<BSKeyPair, string> dctGameType = new Dictionary<BSKeyPair, string>();
                dctGameType.Add(new BSKeyPair(1, 1), "Soccer");
                dctGameType.Add(new BSKeyPair(2, 1), "BasketBall");
                dctGameType.Add(new BSKeyPair(3, 1), "Football");
                dctGameType.Add(new BSKeyPair(5, 1), "Tennis");
                dctGameType.Add(new BSKeyPair(8, 1), "Baseball");
                dctGameType.Add(new BSKeyPair(10, 1), "Golf");
                dctGameType.Add(new BSKeyPair(11, 1), "Mortorsports");
                dctGameType.Add(new BSKeyPair(99, 1), "Orther Sports");
                dctGameType.Add(new BSKeyPair(99, 9), "Mix Sports Parlay");

                return dctGameType;
            }
        }

        public IDictionary<BSKeyPair, string> GetNumberGameTypeList
        {
            get
            {
                IDictionary<BSKeyPair, string> dctGameType = new Dictionary<BSKeyPair, string>();
                dctGameType.Add(new BSKeyPair(161, 81), "Number Game");

                return dctGameType;
            }
        }

        /// <summary>
        /// Gets virtual sport game type list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IDictionary<BSKeyPair, string> GetVirtualSportGameTypeList
        {
            get
            {
                IDictionary<BSKeyPair, string> dctGameType = new Dictionary<BSKeyPair, string>();
                dctGameType.Add(new BSKeyPair(180, 1201), "Virtual Soccer");
                dctGameType.Add(new BSKeyPair(186, 1220), "Virtual Tennis");
                dctGameType.Add(new BSKeyPair(181, 1231), "Virtual Horse Racing");
                dctGameType.Add(new BSKeyPair(182, 1231), "Virtual Greyhounds");
                dctGameType.Add(new BSKeyPair(183, 1231), "Virtual Speedway");
                dctGameType.Add(new BSKeyPair(184, 1231), "Virtual Motosports");
                dctGameType.Add(new BSKeyPair(185, 1231), "Virtual Cycling");

                return dctGameType;
            }
        }

        /// <summary>
        /// Gets keno game type list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IDictionary<BSKeyPair, string> GetKenoGameTypeList
        {
            get
            {
                IDictionary<BSKeyPair, string> dctGameType = new Dictionary<BSKeyPair, string>();
                dctGameType.Add(new BSKeyPair(202, 1501), "Australia Acttab");
                dctGameType.Add(new BSKeyPair(202, 1503), "Slovakia Eklub");
                dctGameType.Add(new BSKeyPair(202, 1504), "Canada Keno");
                dctGameType.Add(new BSKeyPair(202, 1505), "West Canada Keno");
                dctGameType.Add(new BSKeyPair(202, 1507), "Massac");
                dctGameType.Add(new BSKeyPair(202, 1508), "Ohio");
                dctGameType.Add(new BSKeyPair(202, 1509), "Malta");
                dctGameType.Add(new BSKeyPair(202, 1511), "Kentucky");
                dctGameType.Add(new BSKeyPair(202, 1513), "Michigan");

                return dctGameType;
            }
        }

        /// <summary>
        /// Gets racing game type list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IDictionary<BSKeyPair, string> GetRacingGameTypeList
        {
            get
            {
                IDictionary<BSKeyPair, string> dctGameType = new Dictionary<BSKeyPair, string>();
                dctGameType.Add(new BSKeyPair(151, 31), "Racing;UK/Irish Tote");
                dctGameType.Add(new BSKeyPair(151, 41), "Racing;SA Tote");
                dctGameType.Add(new BSKeyPair(151, 51), "Racing;Aust Tote");
                dctGameType.Add(new BSKeyPair(152, 41), "Greyhound;UK/Irish Tote");
                dctGameType.Add(new BSKeyPair(152, 51), "Greyhound;SA Tote");
                dctGameType.Add(new BSKeyPair(153, 51), "Hamess;Aust Tote");

                return dctGameType;
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