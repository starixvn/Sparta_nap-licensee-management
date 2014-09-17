namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Core.Web.Session;

    /// <summary>
    /// Home controller.
    /// </summary>
    [NapSuperAuth]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        [ChildActionOnly]
        public PartialViewResult Menu()
        {
            ViewBag.MenuItemList = CurrentSession.MenuItemList;
            return PartialView("~/Views/Shared/_Menu.cshtml");
        }
    }
}