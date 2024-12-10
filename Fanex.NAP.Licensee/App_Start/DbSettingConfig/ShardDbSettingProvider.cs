namespace Fanex.NAP.Licensee.DbSettingConfig
{
    using System;
    using Data;
    using Data.SqlServer;
    using Service.ShardDb;

    [CLSCompliant(false)]
    public class ShardDbSettingProvider
    {
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

            return new SqlObjectDb(settingKey, commandTimeout, serverIp);
        }
    }
}