// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationController.cs" company="">
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
    using Fanex.NAP.Licensee.Controllers.Attributes;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [CustomHandleError]
    public class SettingConfigurationController:Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
                
    }
}
