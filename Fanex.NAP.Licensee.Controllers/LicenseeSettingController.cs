namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.LicenseeSetting;
    using Model.DataDomain;
    using Model.DTO;
    using Model.Enumerations;
    using Model.ViewModel.LicenseeSetting;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    [CustomValidateAntiForgery]
    public class LicenseeSettingController : BaseController
    {
        private readonly ILicenseeSettingService _licenseeService;
        private readonly ILicenseeVendorService _vendorService;

        private readonly IDictionary<string, string> _pullServiceSetting = new Dictionary<string, string>
        {
            { ProductCode.AGCasino, "AGCasino_VersionKey" },
            { ProductCode.GoldDeluxe, "GoldDeluxe_VersionKey" },
        };

        public LicenseeSettingController()
        {
            _licenseeService = new LicenseeSettingService();
            _vendorService = new LicenseeVendorService();
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
            viewModel.SelectedSystem = viewModel.SystemList.Where(x => x.SystemName == "LRF" || x.SystemName == "OA" || x.SystemName == "Accounting").ToList();

            return View(viewModel);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public ActionResult Edit(string licenseeName)
        {
            var licensee = _licenseeService.GetLicensee(licenseeName);
            var viewModel = new LicenseeViewModel
            {
                Licensee = licensee,
                ProductList = licensee == null ? Enumerable.Empty<LicenseeProduct>() : GetLicenseeProductsWithPullService(licensee.LicenseeID),
                SystemList = licensee == null ? Enumerable.Empty<SystemItem>() : _licenseeService.GetLicenseeSystemList(licensee.LicenseeID)
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
                return Json(new { IsSuccess = false, Error = error });
            }

            var result = _licenseeService.SetUpNewLicensee(criteria);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult OfferProduct(OfferProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            var result = _licenseeService.OfferProduct(criteria);

            return Json(new { IsSuccess = true, Error = result?.Replace(";", "<br>") });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult RemoveProduct(RemoveLicenseeProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            var result = _licenseeService.RemoveProduct(criteria);

            return Json(new { IsSuccess = true, Error = result?.Replace(";", "<br>") });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetLicenseeProductList(int licenseeId)
        {
            return Json(GetLicenseeProductsWithPullService(licenseeId));
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
        public JsonResult GetLapExclusions(int licenseeId)
        {
            var lrfFunctions = _licenseeService.GetLrfFucntionKey(licenseeId);
            var lapFunctions = _vendorService.GetFunctionKeyList();

            var result = lapFunctions.Except(lrfFunctions);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult AddAgent(LicenseeAgentCriteria criteria)
        {
            var error = CheckActiveLicensee(criteria.LicenseeName);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            var errorBuilder = new StringBuilder();

            errorBuilder.Append(CheckEmptyParameter("Supper Wild Card", criteria.SuperWildCard, "<br>"));
            errorBuilder.Append(CheckInvalidRedmineId(criteria.RedmineId));

            if (errorBuilder.Length > 0)
            {
                return Json(new { IsSuccess = false, Error = errorBuilder.ToString() });
            }

            var result = _licenseeService.AddAgent(criteria);

            return Json(new { IsSuccess = result.IsSuccess, Data = $"{result.Data} {(result.Data > 1 ? "agents have" : "agent has")} been added", Error = result.Error });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetSuperCurrencyList(string superWildCard)
        {
            var result = _licenseeService.GetSuperCurrency(superWildCard);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult TerminateLicensee(TerminateLicenseeCriteria criteria)
        {
            var error = new StringBuilder();

            error.Append(CheckEmptyParameter("Licensee Name", criteria.LicenseeName, "<br>"));
            error.Append(CheckInvalidRedmineId(criteria.RedmineId));

            if (error.Length > 0)
            {
                return Json(new { IsSuccess = false, Error = error.ToString() });
            }

            var result = _licenseeService.TerminateLicensee(criteria);

            if (result.Data == null)
            {
                return Json(new { IsSuccess = false, Error = "Licensee does not exists!" });
            }

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult EnablePullService(LicenseeProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            if (!_pullServiceSetting.ContainsKey(criteria.ProductCode))
            {
                return Json(new { IsSuccess = false, Error = "The pull service does not support for this product!" });
            }

            var result = _licenseeService.EnablePullService(criteria, _pullServiceSetting[criteria.ProductCode]);

            return Json(new { IsSuccess = string.IsNullOrEmpty(result), Error = result });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetDeactiveSystemList(int licenseeId)
        {
            var allSystems = _licenseeService.GetSystemList();
            var licenseeSystems = _licenseeService.GetLicenseeSystemList(licenseeId);
            var result = allSystems.Where(x => !licenseeSystems.Any(y => y.Id == x.Id)).ToList();

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult ActivateSystem(ActivateSystemCriteria criteria)
        {
            var error = CheckActiveLicensee(criteria.LicenseeName);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            var errorBuilder = new StringBuilder();

            errorBuilder.Append(CheckEmptyParameter("System", criteria.SystemName, "<br>"));
            errorBuilder.Append(CheckInvalidRedmineId(criteria.RedmineId));

            if (errorBuilder.Length > 0)
            {
                return Json(new { Error = errorBuilder.ToString() });
            }

            var result = _licenseeService.ActivateSystem(criteria);

            return Json(new { Error = result });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetLicenseeSystemList(int licenseeId)
        {
            return Json(_licenseeService.GetLicenseeSystemList(licenseeId));
        }

        private IEnumerable<LicenseeProduct> GetLicenseeProductsWithPullService(int licenseeId)
        {
            var products = _licenseeService.GetLicenseeProducts(licenseeId);

            if (!products.Any())
            {
                return products;
            }

            var integrateSettings = _licenseeService.GetIntegrateSetting(licenseeId);

            foreach (var setting in _pullServiceSetting)
            {
                var product = products.FirstOrDefault(x => x.ProductCode == setting.Key);
                if (product != null)
                {
                    product.PullServiceKey = setting.Value;
                    product.EnablePullService = integrateSettings.Contains(setting.Value);
                }
            }

            return products;
        }

        private string CheckValidLicenseeProduct(LicenseeProductCriteria criteria)
        {
            var error = CheckActiveLicensee(criteria.LicenseeName);
            if (error != null)
            {
                return error;
            }

            var errorBuilder = new StringBuilder();

            errorBuilder.Append(CheckEmptyParameter("Product", criteria.ProductCode, "<br>"));
            errorBuilder.Append(CheckInvalidRedmineId(criteria.RedmineId));

            return errorBuilder.Length > 0 ? errorBuilder.ToString() : null;
        }

        private string CheckValidNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            var error = new StringBuilder();

            error.Append(CheckEmptyParameter("Licensee Name", criteria.LicenseeName, "<br>"));
            error.Append(CheckEmptyParameter("Licensee Type", criteria.LicenseeType, "<br>"));
            error.Append(CheckInvalidRedmineId(criteria.RedmineId));

            if (error.Length > 0)
            {
                return error.ToString();
            }

            var existedLicensees = _licenseeService.GetLicensee(criteria.LicenseeName);
            if (existedLicensees != null)
            {
                return "Licensee Name already exists!";
            }

            return null;
        }

        private string CheckActiveLicensee(string licenseeName)
        {
            var licensee = _licenseeService.GetLicensee(licenseeName);

            return licensee == null || !licensee.IsActive
                ? "Licensee does not exist or is not active!"
                : null;
        }
    }
}