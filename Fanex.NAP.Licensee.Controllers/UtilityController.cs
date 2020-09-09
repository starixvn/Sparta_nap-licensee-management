namespace Fanex.NAP.Licensee.Controllers
{
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Mvc;

    public class UtilityController : BaseController
    {
        [SuppressMessage("Microsoft.Usage", "CA1801:ReviewUnusedParameters", Justification = "Reviewed")]
        public ActionResult Error(string err)
        {
            return View("~/Views/Error/Error.cshtml");
        }
    }
}