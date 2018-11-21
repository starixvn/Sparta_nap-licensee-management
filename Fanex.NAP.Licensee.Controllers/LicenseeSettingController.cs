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
        private readonly ILicenseeSettingService _licenseeService;
        private readonly ILicenseeVendorService _vendorService;
        private readonly ICommonService _commonService;

        public LicenseeSettingController()
        {
            _licenseeService = new LicenseeSettingService();
            _vendorService = new LicenseeVendorService();
            _commonService = new CommonService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Read)]
        public JsonResult Search(LicenseeCriteria criteria)
        {
            var result = _licenseeService.Search(criteria);
            return Json(result);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public ActionResult Add()
        {
            var viewModel = new NewLicenseeViewModel
            {
                ProductList = _licenseeService.GetProductList(),
                SystemList = _licenseeService.GetSystemList(),
                ResellerList = new List<string> { "ONEworks", "Boping", "Zelianta" }
            };

            return View(viewModel);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public ActionResult Edit(string licenseeName)
        {
            var licensee = _licenseeService.GetLicensee(licenseeName);
            var viewModel = new LicenseeViewModel
            {
                Licensee = _licenseeService.GetLicensee(licenseeName),
                ProductList = _licenseeService.GetLicenseeProducts(licensee.LicenseeID)
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult SetUpNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            var error = CheckValidNewLicensee(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Errors = error });
            }

            var result = _licenseeService.SetUpNewLicensee(criteria);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult LaunchProduct(LaunchProductCriteria criteria)
        {
            var error = CheckValidLaunchedProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Errors = error });
            }

            _licenseeService.LaunchProduct(criteria);

            return Json(new { IsSuccess = true });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult OfferProduct(OfferProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Errors = error });
            }

            _licenseeService.OfferProduct(criteria);

            return Json(new { IsSuccess = true });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult RemoveProduct(LicenseeProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Errors = error });
            }

            _licenseeService.RemoveProduct(criteria);

            return Json(new { IsSuccess = true });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetLicenseeProductList(int licenseeId)
        {
            return Json(_licenseeService.GetLicenseeProducts(licenseeId));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetProductList(int excludeLicenseeId)
        {
            var allProducts = _licenseeService.GetProductList();

            if (excludeLicenseeId == 0)
            {
                return Json(allProducts);
            }

            var licenseeProduct = _licenseeService.GetLicenseeProducts(excludeLicenseeId);
            var result = allProducts.Where(x => !licenseeProduct.Any(y => y.ProductCode == x.ProductCode)).ToList();

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public string GetLapExclusions(int licenseeId)
        {
            var lrfFunctions = _licenseeService.GetLrfFucntionKey(licenseeId);
            var lapFunctions = _vendorService.GetFunctionKeyList();

            var result = string.Join("<br/>", lapFunctions.Except(lrfFunctions));

            return result;
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult AddAgent(LicenseeAgentCriteria criteria)
        {
            if (string.IsNullOrWhiteSpace(criteria.SuperWildCard))
            {
                return Json(new { IsSuccess = false, Errors = "Supper Wild Card is empty!" });
            }

            _licenseeService.AddAgent(criteria);

            return Json(new { IsSuccess = true });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetCurrencyList()
        {
            var result = _commonService.GetCurrencyList;

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult TerminateLicensee(string licenseeName)
        {
            if (string.IsNullOrWhiteSpace(licenseeName))
            {
                return Json(new { IsSuccess = false, Errors = "Licensee name is empty!" });
            }

            _licenseeService.TerminateLicensee(licenseeName);

            return Json(new { IsSuccess = true });
        }

        private string CheckValidLaunchedProduct(LaunchProductCriteria criteria)
        {
            if (!criteria.EffectiveDate.HasValue)
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

            if (string.IsNullOrWhiteSpace(criteria.LicenseeType))
            {
                return "Licensee Type is empty!";
            }

            var existedLicensees = _licenseeService.GetLicensee(criteria.LicenseeName);
            if (existedLicensees != null)
            {
                return "Licensee Name already exists!";
            }

            return null;
        }
    }
}