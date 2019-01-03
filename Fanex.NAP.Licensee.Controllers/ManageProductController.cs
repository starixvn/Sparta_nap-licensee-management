namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.LicenseeSetting;
    using Model.Criteria.Product;
    using Model.DataDomain;
    using Model.ViewModel.ManageProduct;
    using Newtonsoft.Json;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    public class ManageProductController : BaseController
    {
        private readonly IManageProductService _service;
        private readonly ILicenseeSettingService _licenseeService;

        public ManageProductController()
        {
            _service = new ManageProductService();
            _licenseeService = new LicenseeSettingService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageProduct, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            var viewModel = new SearchProductViewModel
            {
                LicenseeList = _licenseeService.GetLicenseeList(),
                ProductList = _licenseeService.GetProductList()
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageProduct, Policy = Constant.Policy.Read)]
        public JsonResult Search(LicenseeProductMatrixCriteria criteria)
        {
            var result = _service.Search(criteria);
            var jsonString = JsonConvert.SerializeObject(result.Data);

            return Json(new { Data = jsonString, TotalItem = result.TotalItem });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageProduct, Policy = Constant.Policy.Host)]
        public JsonResult GetNewProductList(string licenseeList)
        {
            var result = _service.GetNewProductList(licenseeList);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageProduct, Policy = Constant.Policy.Host)]
        public JsonResult GetRemoveProductList(string licenseeList)
        {
            var result = _service.GetRemoveProductList(licenseeList);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageProduct, Policy = Constant.Policy.Host)]
        public JsonResult Add(OfferProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            var result = _licenseeService.OfferProduct(criteria);

            return Json(new { IsSuccess = true, Error = result?.Replace(";", "<br/>") });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageProduct, Policy = Constant.Policy.Host)]
        public JsonResult Remove(RemoveLicenseeProductCriteria criteria)
        {
            var error = CheckValidLicenseeProduct(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            var result = _licenseeService.RemoveProduct(criteria);

            return Json(new { IsSuccess = true, Error = result?.Replace(";", "<br/>") });
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

            if (criteria.RedmineId <= 0)
            {
                return "Redmine Id is invalid!";
            }

            return null;
        }
    }
}