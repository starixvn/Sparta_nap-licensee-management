namespace Fanex.NAP.Licensee
{
    using System;
    using System.Configuration;
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Routing;
    using Extension;
    using Fanex.Data.Configuration;
    using Fanex.NAP.Licensee.AppStart;
    using Fanex.RemotingRef;
    using Logging;
    using Logging.Sentry.RavenClient;
    using SharpRaven;

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

        public void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs
            var exception = Server.GetLastError();
            var isIgnore = exception is HttpAntiForgeryException
                          || exception is HttpException
                       || (exception.TargetSite.DeclaringType == typeof(ActionDescriptor) &&
                            exception.TargetSite.Name == "ExtractParameterFromDictionary");
            // Exception when passing wrong data type to action method
            if (!isIgnore)
            {
                LogService.Error(LogMessageHelper.GenerateMessage(exception), exception);
            }
        }
    }
}