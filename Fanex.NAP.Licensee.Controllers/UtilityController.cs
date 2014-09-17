// -----------------------------------------------------------------------
// <copyright file="UtilityController.cs" company="Nexcel">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class UtilityController : BaseController
    {
        public ActionResult Error(string err)
        {
            return View("~/Views/Shared/Error.cshtml");
        }
    }
}