namespace Fanex.NAP.Licensee.Service.Redis
{
    using System;
    using StackExchange.Redis;

    public class RedisService : IRedisService
    {
        private readonly IDatabase _databse;

        public RedisService()
        {
            const int DEFAULT_REDIS_DATABASE = 4;
            RedisConnection redisConnection = new RedisConnection();
            _databse = redisConnection.Connection.GetDatabase(DEFAULT_REDIS_DATABASE);
        }

        public bool AddValue(string key, string value, double hours)
        {
            _databse.StringSet(key, value, TimeSpan.FromHours(hours));
            string result = _databse.StringGet(key);

            return result != null;
        }

        public string GetValue(string key)
        {
            return _databse.StringGet(key);
        }

        public TimeSpan GetRemainingTime(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return TimeSpan.Zero;
            }
            
            var time = _databse.KeyTimeToLive(key);
            if (time.HasValue)
            {
                var totalTime = time.Value;

                return totalTime;
            }

            return TimeSpan.Zero;
        }

        public bool RemoveKey(string key)
        {
            _databse.KeyDelete(key);
            string result = _databse.StringGet(key);

            return result == null;
        }
    }
}