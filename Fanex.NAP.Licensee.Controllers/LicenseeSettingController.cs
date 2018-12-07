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
    using Model.DTO;
    using Model.Enumerations;
    using Model.ViewModel.LicenseeSetting;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
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
                ProductList = GetLicenseeProductsWithPullService(licensee.LicenseeID)
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
            result.Error = result.IsSuccess 
                ? null
                : (string.IsNullOrEmpty(result.Error) ? "Can not create this licensee. Please try later!" : result.Error);

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

            return Json(new { IsSuccess = string.IsNullOrEmpty(result), Error = result });
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

            var pullServiceKey = string.Empty;
            if (criteria.IsRemovePullService)
            {
                _pullServiceSetting.TryGetValue(criteria.ProductCode, out pullServiceKey);
            }

            var result = _licenseeService.RemoveProduct(criteria, pullServiceKey);

            return Json(new { IsSuccess = string.IsNullOrEmpty(result), Error = result });
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
            if (string.IsNullOrWhiteSpace(criteria.SuperWildCard))
            {
                return Json(new { IsSuccess = false, Error = "Supper Wild Card is empty!" });
            }

            if (string.IsNullOrWhiteSpace(criteria.RedmineId))
            {
                return Json(new { IsSuccess = false, Error = "Redmine Id is empty!" });
            }

            var result = _licenseeService.AddAgent(criteria);

            if (result <= 0)
            {
                return Json(new { IsSuccess = false, Error = "There is no new agent to added!" });
            }

            return Json(new { IsSuccess = true, Data = $"{result} {(result > 1 ? "agents have" : "agent has")} been added!" });
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
            if (string.IsNullOrWhiteSpace(criteria.LicenseeName))
            {
                return Json(new { IsSuccess = false, Error = "Licensee name is empty!" });
            }

            if (string.IsNullOrWhiteSpace(criteria.RedmineId))
            {
                return Json(new { IsSuccess = false, Error = "Redmine Id is empty!" });
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
            if (string.IsNullOrWhiteSpace(criteria.LicenseeName))
            {
                return "Licensee Name is empty!";
            }

            if (string.IsNullOrWhiteSpace(criteria.ProductCode))
            {
                return "Product is empty!";
            }

            if (string.IsNullOrWhiteSpace(criteria.RedmineId))
            {
                return "Redmine Id is empty!";
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

            if (string.IsNullOrWhiteSpace(criteria.RedmineId))
            {
                return "Redmine Id is empty!";
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