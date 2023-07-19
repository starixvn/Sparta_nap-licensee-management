using System;
using System.Data.SqlClient;
using Fanex.Data;
using Fanex.NAP.Licensee.Service.ShardDb;

namespace Fanex.NAP.Licensee.DbSettingConfig
{
    [CLSCompliant(false)]
    public class ShardDbSettingProvider : XmlDbSettingProvider
    {
        private readonly IShardInfoAccessor _shardInfoAccessor;

        public ShardDbSettingProvider(IShardInfoAccessor shardInfoAccessor, string resourcePath) : base(resourcePath)
        {
            _shardInfoAccessor = shardInfoAccessor;
        }

        public override IDbSetting GetSetting(string key)
        {
            if (_shardInfoAccessor.TryUseShardDb(key, out var dbServer))
            {
                var shardSpKey = _shardInfoAccessor.GetShardSpKey(key);
                var originalShardSetting = base.GetSetting(shardSpKey);

                var connectionStr = new SqlConnectionStringBuilder(originalShardSetting.ConnectionString)
                {
                    DataSource = dbServer
                };

                var dbSetting = new DbSetting(shardSpKey, originalShardSetting.DbName, connectionStr.ToString(),
                                              originalShardSetting.SpName,
                                              originalShardSetting.CommandTimeout, originalShardSetting.ColumnMaps,
                                              originalShardSetting.FirmParameters);
                return dbSetting;
            }

            return base.GetSetting(key);
        }
    }
}
