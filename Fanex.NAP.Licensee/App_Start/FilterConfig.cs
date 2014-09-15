using System.Web.Mvc;
using Fanex.NAP.Licensee.Controllers.Attributes;

namespace Fanex.NAP.Licensee.AppStart
{
    public static class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new CustomHandleErrorAttribute { View = "Error.cshtml:" }); //by default added
        }
    }
}