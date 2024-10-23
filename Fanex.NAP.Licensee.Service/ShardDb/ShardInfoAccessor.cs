namespace Fanex.NAP.Licensee.Service.ShardDb
{
    using System;
    using System.Web;

    public class ShardInfoAccessor : IShardInfoAccessor
    {
        private const string PrefixShardingCustDb = "shardCustDbSp_";
        private const string PrefixShardingSiteDb = "shardSiteDbSp_";
        public static readonly string SiteDbServer = "X-SiteDbServer";
        public static readonly string CustDbServer = "X-CustDbServer";

        public bool TryUseShardDb(string key, out string dbServer)
        {
            if (IsShardSiteDbSp(key))
            {
                dbServer = SiteDbIp();
                return true;
            }

            if (IsShardCustDbSp(key))
            {
                dbServer = CustDbIp();
                return true;
            }

            dbServer = null;
            return false;
        }

        public string GetShardSpKey(string key)
        {
            return key
                .Replace(PrefixShardingSiteDb, "")
                .Replace(PrefixShardingCustDb, "");
        }

        public static string ToShardSiteDbSp(string key)
        {
            return $"{PrefixShardingSiteDb}{key}";
        }

        public static string ToShardCustDbSp(string key)
        {
            return $"{PrefixShardingCustDb}{key}";
        }

        private static bool IsShardSiteDbSp(string key)
        {
            return key.StartsWith(PrefixShardingSiteDb, StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsShardCustDbSp(string key)
        {
            return key.StartsWith(PrefixShardingCustDb, StringComparison.OrdinalIgnoreCase);
        }

        private static string SiteDbIp()
        {
            return HttpContext.Current?.Request.Headers[SiteDbServer];
        }

        private static string CustDbIp()
        {
            return HttpContext.Current?.Request.Headers[CustDbServer];
        }
    }
}