namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.ViewModel;
    using Fanex.NAP.Licensee.Service;

    [CustomHandleError]
    public class BetSettingController : BaseController
    {
        private readonly ICommonService _commonService;
        private readonly IBetSettingService _betSettingService;

        public BetSettingController()
            : base()
        {
            this._commonService = new CommonService();
            this._betSettingService = new BetSettingService();
        }

        //
        // GET: /BetSetting/

        #region Load default bet setting

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult Default()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Host)]
        [AjaxRequest]
        public ActionResult Default(GetAllDefaultBetSettingCriteria criteria)
        {
            if (criteria.IsValid())
            {
                return Json(_betSettingService.GetAll(criteria));
            }
            return Json(string.Empty);
        }

        #endregion Load default bet setting

        #region Add New

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult AddNew()
        {
            return View(new SingleDefaultBetSettingViewModel());
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Host)]
        [AjaxRequest]
        public ActionResult AddNew(SingleDefaultBetSettingViewModel viewModel)
        {
            return Json(ModifyDefaultBetSetting(viewModel));
        }

        #endregion Add New

        #region Editting

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Read)]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        public ActionResult Edit(string licensee, int? currencyId, int? agentId)
        {
            return View(_betSettingService.Single(new GetSingleDefaultBetSettingCriteria(licensee, currencyId.Value, agentId)));
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Host)]
        [AjaxRequest]
        public ActionResult Edit(SingleDefaultBetSettingViewModel viewModel)
        {
            return Json(ModifyDefaultBetSetting(viewModel));
        }

        #endregion Editting

        #region Logs

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ViewLogs, Policy = Constant.Policy.Read)]
        public ActionResult Logs()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ViewLogs, Policy = Constant.Policy.Host)]
        public ActionResult Logs(ViewLogCriteria criteria)
        {
            return View();
        }

        #endregion Logs

        #region CommonFunction

        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult GetCurrencyList()
        {
            return Json(_commonService.GetCurrencyList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult GetLicenseeList()
        {
            return Json(_commonService.GetLicenseeList, JsonRequestBehavior.AllowGet);
        }

        private ResultInfo ModifyDefaultBetSetting(SingleDefaultBetSettingViewModel viewModel)
        {
            var result = new ResultInfo
            {
                IsOk=false,
                Message="input data is invalid"
            };

            if (viewModel.IsValid)
            {
                viewModel.UserId = CurrentSession.UserId;
                viewModel.IP = Request.UserHostAddress;
               result= _betSettingService.InsertOrUpdate(viewModel.ToCriteria);
            }
           
            return result;
        }

        #endregion CommonFunction
    }
}