using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Fanex.Data.Configuration;
using Fanex.NAP.Licensee.AppStart;

namespace Fanex.NAP.Licensee
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode,
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            DbSettingProviderManager.Current.Start();

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Session_End(object sender, EventArgs e)
        {
            AuthConfig.SignOut();
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            AuthConfig.RegisterAuth(Context);
        }

        /// <summary>
        /// The application errors.
        /// </summary>
        /// <param name="sender">The sender.</param>
        /// <param name="e">The event ARGS.</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Reviewed.")]
        public void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs
            Exception ex = Server.GetLastError().GetBaseException();
            var httpException = ex as HttpException;
            if (httpException != null && httpException.GetHttpCode() == 404)
            {
                return;
            }

            string message = ex.Message +
                             "\r\nSOURCE: " + ex.Source +
                             "\r\nDOMAIN: " + HttpContext.Current.Request.Headers["Host"] +
                             "\r\nFORM: " + string.Join("~", Request.Form) +
                             "\r\nUrl: " + Request.RawUrl +
                             "\r\nQUERYSTRING: " + string.Join("~", Request.QueryString) +
                             "\r\nTARGETSITE: " + ex.TargetSite +
                             "\r\nSTACKTRACE: " + ex.StackTrace +
                             "\r\nBrowser:" + Request.Browser.Type.ToString() +
                             "\r\nBrowserVer:" + Request.Browser.Version.ToString() +
                             "\r\nAgent:" + Request.UserAgent.ToString();

            Logging.LogService.Error(message, ex);
        }
    }
}