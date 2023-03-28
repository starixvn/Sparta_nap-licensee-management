namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.Comparer;
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.DefaultBetSetting;
    using Fanex.NAP.Licensee.Service;
    using ONEbook.UM.Filters;

    /// <summary>
    /// Bet setting controller.
    /// </summary>
    [CustomHandleError]
    [CheckUMFilter]
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

        public BetSettingController(ICommonService commonService, IBetSettingService betSettingService)
        {
            this._commonService = commonService;
            this._betSettingService = betSettingService;
        }

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
            var result = _betSettingService.GetAll(criteria);
            result = SortBetSettingByProduct(result);

            if (criteria.IsValid())
            {
                return Json(result);
            }

            return Json(string.Empty);
        }

        #endregion Load default bet setting

        #region Add New

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult AddNew()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Host)]
        [AjaxRequest]
        public ActionResult AddNew(SingleDefaultBetSettingViewModel viewModel)
        {
            return Json(ModifyDefaultBetSetting(viewModel));
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Host)]
        [AjaxRequest]
        public ActionResult LoadTeamplate(GetSingleDefaultBetSettingCriteria criteria)
        {
            var viewModel = new SingleDefaultBetSettingViewModel();
            if (criteria.IsValid())
            {
                viewModel = _betSettingService.SingleSetting(criteria);
                viewModel.Sportsbook = SortBetSettingByProduct(viewModel.Sportsbook);
            }

            return View("~/Views/BetSetting/_DefaultBetSettingList.cshtml", viewModel);
        }

        #endregion Add New

        #region Editting

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Read)]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        public ActionResult Edit(string licensee, int? currencyId, int? agentId)
        {
            var viewModel = _betSettingService.SingleSetting(new GetSingleDefaultBetSettingCriteria(licensee, currencyId.Value, agentId));
            viewModel.Sportsbook = SortBetSettingByProduct(viewModel.Sportsbook);

            return View(viewModel);
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
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ViewLogs, Policy = Constant.Policy.Read)]
        public ActionResult Logs(GetSettingLogCriteria criteria)
        {
            IList<SettingLogItem> viewModel = new List<SettingLogItem>();
            if (criteria.IsValid())
            {
                viewModel = _betSettingService.GetLogs(criteria);
            }

            ViewData[StaticSiteValue.KENOGAMETYPE] = _commonService.GetKenoGameType;
            return View("~/Views/BetSetting/_LogItems.cshtml", viewModel);
        }

        #endregion Logs

        #region CommonFunction

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult GetCurrencyList()
        {
            return Json(_commonService.GetCurrencyList, JsonRequestBehavior.AllowGet);
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult GetLicenseeList()
        {
            return Json(_commonService.GetLicenseeList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get agent list.
        /// </summary>
        /// <param name="criteria">The criterion.</param>
        /// <returns>The agent list.</returns>
        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult GetAgents(GetAgentListCriteria criteria)
        {
            return Json(_betSettingService.GetAgents(criteria), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Insert Or Update default bet setting.
        /// </summary>
        /// <param name="viewModel">The view model.</param>
        /// <returns>True if successful.</returns>
        private ResultInfo ModifyDefaultBetSetting(SingleDefaultBetSettingViewModel viewModel)
        {
            var result = new ResultInfo
            {
                IsOk = false,
                Message = "input data is invalid"
            };

            if (viewModel.IsValid)
            {
                viewModel.UserId = CurrentSession.UserId;
                viewModel.IP = Request.UserHostAddress;
                result = _betSettingService.InsertOrUpdate(viewModel.ToCriteria);
            }

            return result;
        }

        private static IList<BetSettingBySport> SortBetSettingByProduct(IList<BetSettingBySport> betSettings)
        {
            var orderedList = betSettings.OrderBy(i => i , new SportComparer()).ToList();

            return orderedList;
        }

        private static IList<DefaultBetSetting> SortBetSettingByProduct(IList<DefaultBetSetting> betSettings)
        {
            var orderedList = betSettings.OrderBy(i => i, new SportComparer())
                .GroupBy(x => new { x.Currency, x.AgentID })
                .SelectMany(group => group).ToList();

            return orderedList;
        }

        #endregion CommonFunction
    }
}