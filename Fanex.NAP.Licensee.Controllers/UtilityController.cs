// -----------------------------------------------------------------------
// <copyright file="CommonController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class UtilityController:BaseController
    {
        public ActionResult Error(string err)
        {
            return View("~/Views/Shared/Error.cshtml");
        }
    }
}
