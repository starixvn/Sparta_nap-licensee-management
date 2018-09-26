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
            return View(GetSearchViewModel());
        }

        [HttpGet]
        public ActionResult Get(int agentId = 0)
        {
            var viewModel = new OperatorViewModel();
            if (agentId == 0)
            {
                viewModel.ViewData = GetSearchViewModel();
            }
            else {
                viewModel.Operator = _operatorService.GetOperator(agentId);
            }

            return View(viewModel);
        }

        [HttpPost]
        public JsonResult Search(SearchOperatorCriteria criteria)
        {
            var result = _operatorService.GetOperators(criteria);
            return Json(result);
        }

        [HttpPost]
        public JsonResult Add(OperatorCriteria criteria)
        {
            var result = _operatorService.AddOperator(criteria);
            return Json(result);
        }

        [HttpPost]
        public JsonResult Update(OperatorCriteria criteria)
        {
            var result = _operatorService.UpdateOperator(criteria.AgentId, criteria.OperatorId);
            return Json(result);
        }

        private SearchOperatorViewModel GetSearchViewModel()
        {
            return new SearchOperatorViewModel
            {
                SiteNameList = _operatorService.GetSiteNames(),
                CurrencyList = _commonService.GetCurrencyList
            };
        }
    }
}