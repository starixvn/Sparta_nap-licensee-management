using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Fanex.NAP.Core.Web.Session;
using Fanex.NAP.Core.Web.Attribute;

namespace Fanex.NAP.Licensee.Controllers
{
    [NapAuth]
    public class HomeController : BaseController
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        [ChildActionOnly]
        public PartialViewResult _Menu()
        {
            ViewBag.MenuItemList = CurrentSession.MenuItemList;
            return PartialView("~/Views/Shared/_Menu.cshtml");
        }
    }
}
