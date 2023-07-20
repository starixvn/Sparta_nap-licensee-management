using System;
using Fanex.Data;
using Fanex.NAP.Licensee.Service.ShardDb;

namespace Fanex.NAP.Licensee.DbSettingConfig
{
    public static class DbSettingProviderManagerExtension
    {
        private const string SpNameConfigSource = "~/App_Data/FanexSpName.xml";

        [CLSCompliant(false)]
        public static DbSettingProviderManager UseShardDbSettingProvider(
            this DbSettingProviderManager dbSettingProviderManager)
        {
            return dbSettingProviderManager.Use(new ShardDbSettingProvider(new ShardInfoAccessor(),
                                                                           SpNameConfigSource));
        }
    }
}
