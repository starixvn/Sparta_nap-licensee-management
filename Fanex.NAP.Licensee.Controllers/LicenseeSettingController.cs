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

            var result = _service.SetUpNewLicensee(criteria);

            return Json(result);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult LaunchProduct(LaunchProductCriteria criteria)
        {
            var error = CheckValidLaunchedProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Errors = error });
            }

            var result = _service.LaunchProduct(criteria);

            return Json(new { IsSuccess = result, Errors = result ? string.Empty : "This product was launched by another user!" });
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult OfferProduct(OfferProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Errors = error });
            }

            var result = _service.OfferProduct(criteria);

            return Json(new { IsSuccess = result, Errors = result ? string.Empty : "This product was added by another user!" });
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult RemoveProduct(LicenseeProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Errors = error });
            }

            var result = _service.RemoveProduct(criteria);

            return Json(new { IsSuccess = result, Errors = result ? string.Empty : "This product was launched by another user!" });
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetLicenseeProductList(int licenseeId)
        {
            return Json(_service.GetLicenseeProducts(licenseeId));
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetProductList(int excludeLicenseeId)
        {
            var allProducts = _service.GetProductList();

            if (excludeLicenseeId == 0)
            {
                return Json(allProducts);
            }

            var licenseeProduct = _service.GetLicenseeProducts(excludeLicenseeId);
            var result = allProducts.Where(x => !licenseeProduct.Any(y => y.ProductCode == x.ProductCode)).ToList();

            return Json(result);
        }

        private string CheckValidLaunchedProduct(LaunchProductCriteria criteria)
        {
            if (string.IsNullOrWhiteSpace(criteria.EffectiveDate))
            {
                return "Invalid data!";
            }

            return CheckValidLicenseeProduct(criteria);
        }

        private string CheckValidLicenseeProduct(LicenseeProductCriteria criteria)
        {
            if (string.IsNullOrWhiteSpace(criteria.LicenseeName)
                || string.IsNullOrWhiteSpace(criteria.ProductCode))
            {
                return "Invalid data!";
            }

            return null;
        }

        private string CheckValidNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            if (string.IsNullOrWhiteSpace(criteria.LicenseeName))
            {
                return "Licensee Name is empty!";
            }

            if (string.IsNullOrWhiteSpace(criteria.ResellerName))
            {
                return "Licensee Type is empty!";
            }

            var existedLicensees = _service.Search(new LicenseeCriteria { IsAll = true });
            if (existedLicensees.Any(x => x.LicenseeName == criteria.LicenseeName))
            {
                return "Licensee Name already exists!";
            }

            return null;
        }
    }
}