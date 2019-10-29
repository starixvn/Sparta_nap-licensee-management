namespace Fanex.NAP.Licensee.Service.Redis
{
    using System;

    public interface IRedisService
    {
        string GetValue(string key);

        bool AddValue(string key, string value, double minutes = 15);

        TimeSpan GetRemainingTime(string key);

        bool RemoveKey(string key);
    }
}