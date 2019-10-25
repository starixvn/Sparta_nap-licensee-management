namespace Fanex.NAP.Licensee.Service.Redis
{
    using System;
    using StackExchange.Redis;

    public class RedisConnection
    {
        const string RedisServer = "10.18.200.125:16379";

        private readonly Lazy<ConnectionMultiplexer> LazyConnection = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(RedisServer+ ", abortConnect=false"));

        public ConnectionMultiplexer Connection => LazyConnection.Value;
    }
}