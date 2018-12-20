namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.DataDomain;
    using Model.ViewModel.ManageProduct;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    public class ManageProductController : BaseController
    {
        private readonly IManageProductService _service;
        private readonly ICommonService _commonService;
        private readonly ILicenseeSettingService _licenseeService;

        public ManageProductController()
        {
            _service = new ManageProductService();
            _commonService = new CommonService();
            _licenseeService = new LicenseeSettingService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeSetting, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            var viewModel = new SearchProductViewModel
            {
                LicenseeList = _commonService.GetLicenseeList,
                ProductList = _licenseeService.GetProductList()
            };

            return View(viewModel);
        }
    }
}