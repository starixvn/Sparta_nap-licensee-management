namespace Fanex.NAP.Licensee.Service.Redis
{
    using System;
    using StackExchange.Redis;

    public class RedisService : IRedisService
    {
        private readonly IDatabase _databse;

        public RedisService()
        {
            RedisConnection redisConnection = new RedisConnection();
            _databse = redisConnection.Connection.GetDatabase();
        }

        public bool AddValue(string key, string value, double minutes)
        {
            _databse.StringSet(key, value, TimeSpan.FromMinutes(minutes));
            string result = _databse.StringGet(key);

            return result != null;
        }

        public string GetValue(string key)
        {
            return _databse.StringGet(key);
        }

        public TimeSpan GetRemainingTime(string key)
        {
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