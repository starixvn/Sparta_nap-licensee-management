namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Model.Criteria.LicenseeSetting;
    using Service;

    public class LicenseeSettingController : BaseController
    {
        private readonly ILicenseeSettingService _service;

        public LicenseeSettingController()
        {
            _service = new LicenseeSettingService();
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Search(LicenseeCriteria criteria)
        {
            var result = _service.Search(criteria);
            return Json(result);
        }
    }
}