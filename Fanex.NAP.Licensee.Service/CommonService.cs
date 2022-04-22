namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Caching;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    public class CommonService : ICommonService
    {
        private const string KENOGAMETYPECACHEKEY = "NAP_LICENSEE_MANAGEMENTKENOGAMETYPECACHEKEY";

        private ICache _cache = CacheService.CreateInstance(CacheType.MemoryCache);
        private readonly float PTNumberToInterval = 10000f;

        /// <summary>
        /// Gets licensee list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IList<LicenseeItem> GetLicenseeList
        {
            get
            {
                using (var db = ObjectDbFactory.CreateInstance("NAP_SpecialCustSetting_LicenseeList"))
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
                using (var db = ObjectDbFactory.CreateInstance("NAP_SpecialCustSetting_CurrencyList"))
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
                    using (var db = ObjectDbFactory.CreateInstance("NAP_SpecialCustSettingGameType_Sel"))
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

                return new List<ProductTypeItem>()
                {
                    new ProductTypeItem(1, "Sportsbook", betPT),
                    new ProductTypeItem(161, "Number Game", betPT),
                    new ProductTypeItem(202, "Keno", betPT),
                };
            }
        }

        public IList<string> GetPositionTakingList
        {
            get
            {
                List<int> lstInts = Enumerable.Range(0, 10001).Where(n => n % 5 == 0).ToList();
                IList<string> lstPTs = new List<string>();
                lstInts.ForEach(n => lstPTs.Add((n / PTNumberToInterval).ToString("0.####")));

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
                dctGameType.Add(new BSKeyPair(9901, 1), "Saba Soccer");
                dctGameType.Add(new BSKeyPair(1, 9), "Soccer Parlay");
                dctGameType.Add(new BSKeyPair(43, 1), "ESport");
                dctGameType.Add(new BSKeyPair(2, 1), "BasketBall");
                dctGameType.Add(new BSKeyPair(9902, 1), "Saba Basketball");
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
        /// Gets keno game type list.
        /// </summary>
        /// <value>A dictionary.</value>
        public IDictionary<BSKeyPair, string> GetKenoGameTypeList
        {
            get
            {
                IDictionary<BSKeyPair, string> dctGameType = new Dictionary<BSKeyPair, string>();
                dctGameType.Add(new BSKeyPair(202, 1501), "Australia Acttab");

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
            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeSuperList"))
            {
                return db.Query<LicenseeItem>(new { Site = siteName }).ToList();
            }
        }

        public IList<CurrencyItem> GetLicenseeCurrencyList(int licenseeId)
        {
            using (var db = ObjectDbFactory.CreateInstance("Nap_LM_LicenseeCurrency_Select"))
            {
                return db.Query<CurrencyItem>(new { LicenseeId = licenseeId }).ToList();
            }
        }

        public IList<LicenseeAgent> GetLicenseeAgentList(int SRecommend)
        {
            var criteria = new GetLicenseeAgentList();
            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                IList<LicenseeAgent> result = new List<LicenseeAgent>();
                result.Add(new LicenseeAgent { Id = 0, Name = "All" });
                return result.Concat(db.Query<LicenseeAgent>(new { SRecommend }).OrderBy(item => item.Name).ToList()).ToList();
            }
        }
    }
}