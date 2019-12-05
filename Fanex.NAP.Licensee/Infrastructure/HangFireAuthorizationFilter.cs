namespace Fanex.NAP.Licensee.Infrastructure
{
    using System.Configuration;
    using System.Web;
    using Hangfire.Dashboard;

    public class HangFireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            var adminUserName = ConfigurationManager.AppSettings["HangfireUserName"];
            var user = HttpContext.Current.User;

            return user.Identity.IsAuthenticated && user.Identity.Name == adminUserName;
        }
    }
}