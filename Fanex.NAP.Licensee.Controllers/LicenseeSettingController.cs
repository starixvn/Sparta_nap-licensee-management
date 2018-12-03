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

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    public class LicenseeSettingController : BaseController
    {
        private readonly ILicenseeSettingService _licenseeService;
        private readonly ILicenseeVendorService _vendorService;

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
                ProductList = _licenseeService.GetLicenseeProducts(licensee.LicenseeID, true)
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

            var result = _licenseeService.SetUpNewLicensee(criteria, CurrentSession.UserId);
            result.Error = result.IsSuccess ? null : "Can not create this licensee. Please try later!";

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

            _licenseeService.OfferProduct(criteria, CurrentSession.UserId);

            return Json(new { IsSuccess = true });
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

            var result = _licenseeService.RemoveProduct(criteria, CurrentSession.UserId);

            return Json(new { IsSuccess = result, Error = result ? null : "The product has been removed by someone!" });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetLicenseeProductList(int licenseeId)
        {
            return Json(_licenseeService.GetLicenseeProducts(licenseeId, true));
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
                return Json(new { IsSuccess = false, Error = "Supper Wild Card is empty!" });
            }

            var result = _licenseeService.AddAgent(criteria, CurrentSession.UserId);

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
        public JsonResult TerminateLicensee(string licenseeName)
        {
            if (string.IsNullOrWhiteSpace(licenseeName))
            {
                return Json(new { IsSuccess = false, Error = "Licensee name is empty!" });
            }

            var result = _licenseeService.TerminateLicensee(licenseeName, CurrentSession.UserId);

            if (result.Data == null)
            {
                return Json(new { IsSuccess = false, Error = "Licensee does not exists!" });
            }

            if (!result.IsSuccess)
            {
                return Json(new { IsSuccess = false, Error = "This licensee has been terminated by someone or it does not support for this product!" });
            }

            return Json(new { IsSuccess = true, Data = result.Data });
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

            var result = _licenseeService.EnablePullService(criteria, CurrentSession.UserId);

            return Json(new { IsSuccess = result, Error = result ? null : "The pull service does not support for this product!" });
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