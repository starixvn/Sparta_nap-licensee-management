namespace Fanex.NAP.Licensee.DbSettingConfig
{
    using System;
    using System.Collections.Generic;
    using Data;
    using Data.SqlServer;
    using Service.ShardDb;

    [CLSCompliant(false)]
    public class ShardDbSettingProvider
    {
        private readonly Dictionary<string, string> _replaceIps = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "10.146.11.130", "dbtrans.dp.gamora.prod,7104" },
            { "10.146.11.160", "dbsite01.dp.gamora.prod,7131" },
            { "10.146.11.161", "dbsite02.dp.gamora.prod,7132" },
            { "10.146.11.162", "dbsite03.dp.gamora.prod,7133" },
            { "10.146.11.150", "dbcust.dp.gamora.prod,7105" }
        };

        private readonly IShardInfoAccessor _shardInfoAccessor;

        public ShardDbSettingProvider(IShardInfoAccessor shardInfoAccessor)
        {
            _shardInfoAccessor = shardInfoAccessor;
        }

        public static string ProviderName => nameof(ShardDbSettingProvider);

        public IObjectDb CreateObjectDbFunc(string settingKey, int? commandTimeout, string serverIp)
        {
            if (_shardInfoAccessor.TryUseShardDb(settingKey, out var dbServer))
            {
                serverIp = dbServer;
            }

            if (_replaceIps.TryGetValue(serverIp, out var replaceIp))
            {
                serverIp = replaceIp;
            }

            return new SqlObjectDb(settingKey, commandTimeout, serverIp);
        }
    }
}