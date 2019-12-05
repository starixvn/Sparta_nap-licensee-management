namespace Fanex.NAP.Licensee.Service.Redis
{
    using System;
    using System.Configuration;
    using StackExchange.Redis;

    public class RedisConnection
    {
        private readonly Lazy<ConnectionMultiplexer> LazyConnection = new Lazy<ConnectionMultiplexer>(() => 
            ConnectionMultiplexer.Connect(ConfigurationManager.AppSettings["RedisConnectionString"]));

        public ConnectionMultiplexer Connection => LazyConnection.Value;
    }
}