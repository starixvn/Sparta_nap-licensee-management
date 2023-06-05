namespace Fanex.NAP.Licensee.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.Comparer;
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.Log;
    using Fanex.NAP.Licensee.Service;
    using Fanex.NAP.Licensee.Service.Constants;
    using ONEbook.UM.Filters;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;

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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult AddNew()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Host)]
        [AjaxRequest]
        public ActionResult AddNew(SingleDefaultBetSettingViewModel viewModel)
        {
            return Json(ModifyDefaultBetSetting(viewModel));
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Host)]
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        public ActionResult Edit(string licensee, int? currencyId, int? agentId)
        {
            var viewModel = _betSettingService.SingleSetting(new GetSingleDefaultBetSettingCriteria(licensee, currencyId.Value, agentId));
            viewModel.Sportsbook = SortBetSettingByProduct(viewModel.Sportsbook);

            return View(viewModel);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Host)]
        [AjaxRequest]
        public ActionResult Edit(SingleDefaultBetSettingViewModel viewModel)
        {
            return Json(ModifyDefaultBetSetting(viewModel));
        }

        #endregion Editting

        #region Logs

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult Logs()
        {
            return View();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult GetLogSettings()
        {
            var licensees = _commonService.GetLicenseeList;
            var superWithCurrencies = _commonService.GetSuperLicenseeList(licensees.FirstOrDefault()?.Name);
            var currentDate = DateTime.Now.ToString("yyyy-MM-dd 00:00:00");

            return Json(new
            {
                Licensees = licensees,
                CurrentDate = currentDate,
                SuperWithCurrencies = superWithCurrencies,
                Agents = _commonService.GetLicenseeAgentList(superWithCurrencies.FirstOrDefault().Id),
                SportNames = new { _commonService.GetGameTypeList.Keys, _commonService.GetGameTypeList.Values }
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public JsonResult GetReport(GetSettingLogViewModel model)
        {
            var criteria = new GetSettingLogCriteria();
            FormatSettingLogCriteria(model, criteria);
            return Json(new { Data = _betSettingService.GetLogs(criteria) }, JsonRequestBehavior.AllowGet);
        }

        private void FormatSettingLogCriteria(GetSettingLogViewModel model, GetSettingLogCriteria criteria)
        {
            var licensee = _commonService.GetLicenseeList.First(_ => _.Id == model.LicenseeId);
            criteria.CurrencyID = _commonService.GetSuperLicenseeList(licensee.Name).First(_ => _.Id == model.CustId).CurrencyId;
            criteria.AgentID = model.AgentId > 0 ? model.AgentId : (int?)null;
            criteria.LicenseeID = model.LicenseeId;
            criteria.FromDate = Convert.ToDateTime($"{model.FromDate} {DateTimeConstants.StartOfDayTime}");
            criteria.ToDate = Convert.ToDateTime($"{model.ToDate} {DateTimeConstants.EndOfDayTime}");
        }

        #endregion Logs

        #region CommonFunction

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        [AjaxRequest]
        public ActionResult GetCurrencyList()
        {
            return Json(_commonService.GetCurrencyList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        [AjaxRequest]
        public ActionResult GetLicenseeList()
        {
            return Json(_commonService.GetLicenseeList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        [AjaxRequest]
        public ActionResult GetSuperLicenseeList(string siteName)
        {
            return Json(_commonService.GetSuperLicenseeList(siteName), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        [AjaxRequest]
        public ActionResult GetLicenseeAgentList(int sRecommend)
        {
            return Json(_commonService.GetLicenseeAgentList(sRecommend), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get agent list.
        /// </summary>
        /// <param name="criteria">The criterion.</param>
        /// <returns>The agent list.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        [AjaxRequest]
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
            var orderedList = betSettings.OrderBy(i => i, new SportComparer()).ToList();

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