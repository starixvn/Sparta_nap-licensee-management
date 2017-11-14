namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.Core.Web.Attribute;
    using ONEbook.UM.Filters;

    /// <summary>
    /// Home controller.
    /// </summary>
    [NapSuperAuth]
    [CheckUMFilter]
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

        public ActionResult Demo() => View();
    }
}