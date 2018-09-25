namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.Operator;
    using Model.DataDomain;
    using Model.ViewModel.ManageOperator;
    using Service;

    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Read)]
    public class ManageOperatorController : BaseController
    {
        private readonly IManageOperatorService _operatorService;
        private readonly ICommonService _commonService;

        public ManageOperatorController()
        {
            _operatorService = new ManageOperatorService();
            _commonService = new CommonService();
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View(GetViewModel());
        }

        [HttpPost]
        public JsonResult Search(OperatorCriteria criteria)
        {
            var result = _operatorService.GetOperators(criteria);
            return Json(result);
        }

        private ManageOperatorViewModel GetViewModel()
        {
            return new ManageOperatorViewModel
            {
                SiteNameList = _operatorService.GetSiteNames(),
                CurrencyList = _commonService.GetCurrencyList
            };
        }
    }
}