namespace Fanex.NAP.Licensee.Service.Redis
{
    using System;
    using StackExchange.Redis;

    public class RedisConnection
    {
        private static Lazy<ConnectionMultiplexer> LazyConnection = new Lazy<ConnectionMultiplexer>(() =>
        {
            return ConnectionMultiplexer.Connect("localhost, abortConnect=false");
        });

        public ConnectionMultiplexer Connection
        {
            get
            {
                return LazyConnection.Value;
            }
        }
    }
}