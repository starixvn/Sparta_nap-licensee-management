namespace Fanex.NAP.Licensee
{
    using System;
    using System.Configuration;
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Routing;
    using AppStart;
    using Caching;
    using Data;
    using Data.SqlServer;
    using DbSettingConfig;
    using Extension;
    using Logging;
    using Logging.Sentry;
    using ONEbook.UM;
    using ONEbook.UM.Configurations;
    using ONEbook.UM.Helpers;
    using ONEbook.UM.NETFramework;
    using ONEbook.UM.Transport;
    using RemotingRef;
    using Sentry;
    using Service.ShardDb;

    /// <summary>
    ///     MVC application.
    /// </summary>
    public class MvcApplication : HttpApplication
    {
        public void Application_Error(object sender, EventArgs e)
        {
            //// Code that runs when an unhandled error occurs
            var exception = Server.GetLastError();
            var isIgnore = exception is HttpAntiForgeryException
                           || exception is HttpException
                           || (exception.TargetSite.DeclaringType == typeof(ActionDescriptor)
                               && exception.TargetSite.Name == "ExtractParameterFromDictionary");

            //// Exception when passing wrong data type to action method
            if (!isIgnore)
            {
                LogService.Error(LogMessageHelper.GenerateMessage(exception), exception);
            }
        }

        protected void Application_Start()
        {
            LogManager
                .SetDefaultLogCategory(ConfigurationManager.AppSettings["LogCategory"])
                .Use(new SentryLogging(new SentryOptions
                {
                    Dsn = new Dsn(ConfigurationManager.AppSettings["SentryDSN"])
                }));

            DbSettingProviderManager
                .StartNewSession()
                .WithSqlServer()
                .Register(
                    ShardDbSettingProvider.ProviderName,
                    new ShardDbSettingProvider(new ShardInfoAccessor()).CreateObjectDbFunc)
                .UseDefaultDbSettingProvider("~/App_Data", true)
                .Run();
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            RefDataTypeContainer.ConnectTo(new Uri(ConfigurationManager.AppSettings["Fanex.RemotingRef.Service.Url"]))
                .FromApplication("Fanex.NAP.LicenseeManagement");

            var umConfig = new UMClientConfiguration().Initialize();

            UMClientManager
                .UseConfig(umConfig)
                .UseCacheService(new UMCacheService(new CacheService()))
                .UseRestClient(new UMRestClient(umConfig))
                .UseHttpContext(new HttpContextHelper());
        }

        protected void Session_End(object sender, EventArgs e)
        {
            AuthConfig.SignOut();
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            AuthConfig.RegisterAuth(Context);
        }
    }
}