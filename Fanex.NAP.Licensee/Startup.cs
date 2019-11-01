using Microsoft.Owin;

[assembly: OwinStartup(typeof(Fanex.NAP.Licensee.Startup))]
namespace Fanex.NAP.Licensee
{
    using System.Configuration;
    using Hangfire;
    using Hangfire.Redis;
    using Infrastructure;
    using Owin;
    using Service.Redis;

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigHangfire(app);
        }

        public void ConfigHangfire(IAppBuilder app)
        {
            var redisConnection = new RedisConnection().Connection;
            var options = new RedisStorageOptions
            {
                Prefix = ConfigurationManager.AppSettings["RedisPrefix"]
            };

            GlobalConfiguration.Configuration.UseLogProvider(new HangFireLoggingProvider());
            GlobalConfiguration.Configuration.UseRedisStorage(redisConnection, options);

            app.UseHangfireDashboard("/hangfire", new DashboardOptions()
            {
                Authorization = new[] { new HangFireAuthorizationFilter() },
                DisplayStorageConnectionString = false
            });
            app.UseHangfireServer();
        }
    }
}