using System;
using System.Web;

namespace Fanex.NAP.Licensee.Service.ShardDb
{
    public class ShardInfoAccessor : IShardInfoAccessor
    {
        private const string PrefixSharding = "shardSp_";
        public static readonly string SiteDbServer = "X-SiteDbServer";

        public bool TryUseShardDb(string key, out string dbServer)
        {
            if (IsShardSp(key))
            {
                dbServer = SiteIp();
                return true;
            }

            dbServer = null;
            return false;
        }

        public string GetShardSpKey(string key)
        {
            return key.Substring(PrefixSharding.Length);
        }

        public static string ToShardSp(string key)
        {
            return $"{PrefixSharding}{key}";
        }

        private static bool IsShardSp(string key)
        {
            return key.StartsWith(PrefixSharding, StringComparison.OrdinalIgnoreCase);
        }

        private static string SiteIp()
        {
            return HttpContext.Current?.Request.Headers[SiteDbServer];
        }
    }
}
