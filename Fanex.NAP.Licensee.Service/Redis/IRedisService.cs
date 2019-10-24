namespace Fanex.NAP.Licensee.Service.Redis
{
    using System;

    public interface IRedisService
    {
        string GetValue(string key);

        bool AddValue(string key, string value, double hours = 8);

        TimeSpan GetRemainingTime(string key);

        bool RemoveKey(string key);
    }

}