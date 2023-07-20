namespace Fanex.NAP.Licensee.Service.ShardDb
{
    public interface IShardInfoAccessor
    {
        bool TryUseShardDb(string key, out string dbServer);

        string GetShardSpKey(string key);
    }
}
