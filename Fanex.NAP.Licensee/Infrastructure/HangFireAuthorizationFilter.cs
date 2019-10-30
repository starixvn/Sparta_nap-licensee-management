namespace Fanex.NAP.Licensee.Infrastructure
{
    using System.Web;
    using Hangfire.Dashboard;

    public class HangFireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context) => HttpContext.Current.User.Identity.IsAuthenticated;
    }
}