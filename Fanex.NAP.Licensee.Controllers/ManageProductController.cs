namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Read)]
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Read)]
        public JsonResult Search(LicenseeProductMatrixCriteria criteria)
        {
            var result = _service.Search(criteria);
            var jsonString = JsonConvert.SerializeObject(result.Data);

            return Json(new { Data = jsonString, TotalItem = result.TotalItem });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetNewProductList(string licenseeList)
        {
            var result = _service.GetNewProductList(licenseeList);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetRemoveProductList(string licenseeList)
        {
            var result = _service.GetRemoveProductList(licenseeList);

            return Json(result);
        }
    }
}