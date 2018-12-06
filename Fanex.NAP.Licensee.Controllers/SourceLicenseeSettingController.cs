namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.DataDomain;
    using Model.ViewModel.ManageOperator;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    public class SourceLicenseeSettingController : BaseController
    {
        private readonly ISourceLicenseeSettingService _service;

        private readonly ICommonService _commonService;

        public SourceLicenseeSettingController()
        {
            _service = new SourceLicenseeSettingService();
            _commonService = new CommonService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SourceLicenseeSetting, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            var viewModel = new SearchSourceLicenseeViewModel
            {
                CurrencyList = _commonService.GetCurrencyList,
                SiteNameList = _commonService.GetLicenseeList,
                RoleList = GetRoleList()
            };

            return View(viewModel);
        }

        private IDictionary<int, string> GetRoleList()
        {
            return new Dictionary<int, string>
            {
                { 1, "Member" },
                { 2, "Agent" }
            };
        }
    }
}