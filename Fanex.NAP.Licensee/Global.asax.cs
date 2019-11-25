namespace Fanex.NAP.Licensee
{
    using System;
    using System.Configuration;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Routing;
    using Fanex.Data.Configuration;
    using Fanex.NAP.Licensee.AppStart;
    using Fanex.RemotingRef;
    using Logging;
    using Logging.RabbitMQ;
    using Logging.Sentry.RavenClient;
    using SharpRaven;
    using SharpRaven.Data;

    /// <summary>
    /// MVC application.
    /// </summary>
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            LogManager
             .SetDefaultLogCategory(ConfigurationManager.AppSettings["LogCategory"])
             .Use(new SentryLogging(new SentryEngineOptions
             {
                 Dsn = new Dsn(ConfigurationManager.AppSettings["SentryDSN"])
             }));

            DbSettingProviderManager.Current.Start();
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            RefDataTypeContainer.ConnectTo(new Uri(ConfigurationManager.AppSettings["Fanex.RemotingRef.Service.Url"]))
                .FromApplication("Fanex.NAP.LicenseeManagement");
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