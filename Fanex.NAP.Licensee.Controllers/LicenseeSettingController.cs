namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.LicenseeSetting;
    using Model.DataDomain;
    using Model.ViewModel.LicenseeSetting;
    using ONEbook.UM.Filters;
    using Service;

    [CustomHandleError]
    [CheckUMFilter]
    public class LicenseeSettingController : BaseController
    {
        private readonly ILicenseeSettingService _service;

        public LicenseeSettingController()
        {
            _service = new LicenseeSettingService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Read)]
        public JsonResult Search(LicenseeCriteria criteria)
        {
            var result = _service.Search(criteria);
            return Json(result);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public ActionResult Add()
        {
            var viewModel = new NewLicenseeViewModel
            {
                ProductList = _service.GetProductList(),
                SystemList = _service.GetSystemList(),
                ResellerList = new List<string> { "ONEworks", "Boping", "Zelianta" }
            };

            return View(viewModel);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public ActionResult Edit(int licenseeId)
        {
            var viewModel = new LicenseeViewModel
            {
                Licensee = _service.GetLicensee(licenseeId),
                ProductList = _service.GetLicenseeProducts(licenseeId)
            };

            return View(viewModel);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult SetUpNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            var error = CheckValidNewLicensee(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Errors = error });
            }

            var newLicensee = _service.SetUpNewLicensee(criteria);

            return Json(new { IsSuccess = true, Result = newLicensee });
        }

        private string CheckValidNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            if (string.IsNullOrWhiteSpace(criteria.LicenseeName))
            {
                return "Licensee Name is empty";
            }

            if (string.IsNullOrWhiteSpace(criteria.ResellerName))
            {
                return "Licensee Type is empty";
            }

            var existedLicensees = _service.Search(new LicenseeCriteria { IsAll = true });
            if (existedLicensees.Any(x => x.LicenseeName == criteria.LicenseeName))
            {
                return "Licensee Name already exists";
            }

            return null;
        }
    }
}