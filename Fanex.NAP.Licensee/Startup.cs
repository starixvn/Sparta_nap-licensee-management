using Microsoft.Owin;

[assembly: OwinStartup(typeof(Fanex.NAP.Licensee.Startup))]

namespace Fanex.NAP.Licensee
{
    using Fanex.Logging;
    using Fanex.NAP.Licensee.Extension;
    using Hangfire;
    using Hangfire.Redis;
    using Infrastructure;
    using Owin;
    using Service.Redis;
    using System;
    using System.Configuration;
    using System.Web;

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            try
            {
                ConfigHangfire(app);
            }
            catch (Exception exception)
            {
                LogService.Error(LogMessageHelper.GenerateMessage(exception), exception);
                throw;
            }
        }

        public void ConfigHangfire(IAppBuilder app)
        {
            var redisConnection = new RedisConnection().Connection;
            var options = new RedisStorageOptions
            {
                Prefix = ConfigurationManager.AppSettings["RedisPrefix"],
                Db = 4
            };

            GlobalConfiguration.Configuration.UseLogProvider(new HangFireLoggingProvider());
            GlobalConfiguration.Configuration.UseRedisStorage(redisConnection, options);

            app.UseHangfireDashboard("/hangfire", new DashboardOptions
            {
                Authorization = new[] { new HangFireAuthorizationFilter() },
                DisplayStorageConnectionString = false,
                AppPath = VirtualPathUtility.ToAbsolute("~")
            });
            app.UseHangfireServer();
        }
    }
}