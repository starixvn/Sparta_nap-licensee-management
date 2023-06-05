// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.Comparer;
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.ViewModel.Log;
    using Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration;
    using Fanex.NAP.Licensee.Service;
    using Fanex.NAP.Licensee.Service.Constants;
    using ONEbook.UM.Filters;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;

    /// <summary>
    /// Setting Configuration Controller.
    /// </summary>
    [CustomHandleError]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Host)]
    [CheckUMFilter]
    public class SettingConfigurationController : BaseController
    {
        private const string BSPattern = "<BL SportType=\"{0}\" Bettype=\"{1}\" MinBet=\"{2}\" MaxBet=\"{3}\" MaxPerMatch=\"{4}\" MaxPerNumber=\"{5}\" MaxPayoutPerMatch=\"{6}\"/>";

        private readonly ICommonService _commonService;
        private readonly ISettingConfigurationService _settingConfigurationService;
        private readonly IBetSettingService _betSettingService;

        public SettingConfigurationController()
            : base()
        {
            _commonService = new CommonService();
            _settingConfigurationService = new SettingConfigurationService();
            _betSettingService = new BetSettingService();
        }

        public SettingConfigurationController(ICommonService commonService, ISettingConfigurationService settingConfigurationService, IBetSettingService betSettingService)
        {
            _commonService = commonService;
            _settingConfigurationService = settingConfigurationService;
            _betSettingService = betSettingService;
        }

        public ActionResult Index()
        {
            return View();
        }

        #region Bet setting

        public PartialViewResult EditBetSetting(int sportType)
        {
            const string rootPath = "BetSetting/";
            return sportType == SportType.SportsBook ? PartialView(rootPath + "EditBSSportsbook") : PartialView(rootPath + "UnsupportedFunction");
        }

        public PartialViewResult EditDefaultBetSetting(int productType)
        {
            const string rootPath = "BetSetting/";
            return productType == SportType.SportsBook ? PartialView(rootPath + "EditDBSSportsbook") : PartialView(rootPath + "UnsupportedFunction");
        }

        public JsonResult GetDefaultBetSetting(GetDefaultBetSettingViewModel model)
        {
            if (model.CurrencyId == -1 || model.LicenseeName == null)
            {
                return Json("Can't get Default Bet Setting!", JsonRequestBehavior.AllowGet);
            }

            if (model.ProductTypeId != SportType.SportsBook)
            {
                return Json("Unknown Default Bet Setting!", JsonRequestBehavior.AllowGet);
            }

            var dbsItems = _betSettingService.SingleSetting(new GetSingleDefaultBetSettingCriteria(model.LicenseeName, model.CurrencyId, model.AgentId));
            var dbsSportsbookItems = dbsItems.Sportsbook.OrderBy(i => i, new SportComparer()).ToList();

            return Json(new BSSportsbookViewModel(dbsSportsbookItems), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEditBetSettingData(SettingConfigFilterViewModel settingConfigVm)
        {
            if (settingConfigVm.ProdId != SportType.SportsBook)
            {
                return Json("Unknown Bet Setting!", JsonRequestBehavior.AllowGet);
            }

            var sportsBookItems = _settingConfigurationService
                .GetBSSportsbookItemWithSuperInfo(settingConfigVm.CustId, settingConfigVm.ProdId, settingConfigVm.AgentId, settingConfigVm.Option);
            var sportsBookVm = new BSSportsbookViewModel(sportsBookItems, _commonService.GetSportsbookGameTypeList);

            return Json(sportsBookVm, JsonRequestBehavior.AllowGet);
        }

        public PartialViewResult ReviewBetSetting(int sportType)
        {
            const string rootPath = "BetSetting/";
            return sportType == SportType.SportsBook ? PartialView(rootPath + "ReviewBSSportsbook") : PartialView(rootPath + "UnsupportedFunction");
        }

        [HttpPost]
        public JsonResult UpdateBetSettingSportsbook(BSSportsbookViewModel sportsbookVM)
        {
            var updateItem = new UpdateBetSettingSportsbookItem();

            FormatBetSettingSportsbookItem(updateItem, sportsbookVM);
            updateItem.UserId = CurrentSession.UserId;
            updateItem.IP = Request.UserHostAddress;

            updateItem.UpdBetLimit = ToXmlSetting(sportsbookVM.BSRows.Count > 0 ? sportsbookVM.BSRows[0] : null);
            updateItem.UpdNewMember = ToXmlSetting(sportsbookVM.DBSRows.Count > 0 ? sportsbookVM.DBSRows[0] : null);

            var result = _settingConfigurationService.UpdateBetSettingSportsbook(updateItem);

            return new JsonResult { Data = new BSResultViewModel(string.Empty, result.Code, result.IsOk, result.Message) };
        }

        [HttpPost]
        public JsonResult CheckBetSettingSportsbook(BSSportsbookViewModel sportsbookVM)
        {
            var updateItem = new CheckBetSettingSportsbookItem();
            FormatBetSettingSportsbookItem(updateItem, sportsbookVM);

            var violatedResultItems = GetViolatedResultItems(updateItem, sportsbookVM);

            return violatedResultItems.Count == 0
                ? new JsonResult { Data = new BSResultViewModel(string.Empty, 0, true, string.Empty) }
                : new JsonResult { Data = violatedResultItems[0] };
        }

        private List<BSResultViewModel> GetViolatedResultItems(CheckBetSettingSportsbookItem updateItem, BSSportsbookViewModel viewModel)
        {
            var violatedResultItems = new List<BSResultViewModel>();

            var bsRows = viewModel.BSRows;
            var dbsRows = viewModel.DBSRows;

            for (var i = 0; i < bsRows.Count; i++)
            {
                updateItem.UpdBetLimit = bsRows[i].IsRowSelected ? ToXmlSetting(bsRows[i]) : string.Empty;
                updateItem.UpdNewMember = (dbsRows != null && dbsRows[i].IsRowSelected) ? ToXmlSetting(dbsRows[i]) : string.Empty;

                var result = _settingConfigurationService.CheckBetSettingSportsbook(updateItem);

                if (!result.IsOk)
                {
                    violatedResultItems.Add(new BSResultViewModel(bsRows[i].BetTypeName, result.Code, result.IsOk, result.Message));
                }

                updateItem.ErrCode = 0;
                updateItem.ErrMsg = null;
            }

            return violatedResultItems.OrderBy(_ => SettingConfigurationConstants.AgentDBSErrorCodes.Split(',').Contains(_.Code.ToString())
                                                    || SettingConfigurationConstants.CurrencyDBSErrorCodes.Split(',').Contains(_.Code.ToString()))
                .ToList();
        }

        private static void FormatBetSettingSportsbookItem(BetSettingSportsbookItemBase updateItem, BSSportsbookViewModel sportsbookVM)
        {
            updateItem.CustId = sportsbookVM.CustId;
            updateItem.ExistedMember = sportsbookVM.ExistedMember;
            updateItem.AgentId = sportsbookVM.AgentId;
            updateItem.Option = sportsbookVM.Option;
            updateItem.IsNewMember = sportsbookVM.IsNewMember;
        }

        private static string ToXmlSetting(BSRowBaseViewModel row)
        {
            if (row == null)
            {
                return string.Empty;
            }

            var xml = new StringBuilder("<ROOT>");
            xml.Append(string.Format(BSPattern, row.SportTypeId, row.BetTypeId, row.MinBet, row.MaxBet, row.MaxPerMatch, null, row.MaxPayoutPerMatch));
            xml.Append("</ROOT>");

            return xml.ToString();
        }

        #endregion Bet setting

        #region Filter

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        [HttpGet]
        [AjaxRequest]
        public ActionResult GetLicenseeList()
        {
            return Json(_commonService.GetLicenseeList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        public ActionResult GetSuperLicenseeList(string siteName)
        {
            return Json(_commonService.GetSuperLicenseeList(siteName), JsonRequestBehavior.AllowGet);
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        [HttpGet]
        [AjaxRequest]
        public ActionResult GetProductTypeList()
        {
            return Json(_commonService.GetProductTypeList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        public ActionResult GetSettings()
        {
            var licensees = _commonService.GetLicenseeList;

            return Json(
            new
            {
                LicenseeList = licensees,
                SuperLicenseeList = _commonService.GetSuperLicenseeList(licensees.FirstOrDefault().Name),
                ProductTypeList = _commonService.GetProductTypeList,
                AgentList = _commonService.GetLicenseeAgentList(_commonService.GetSuperLicenseeList(licensees.FirstOrDefault().Name).FirstOrDefault().Id)
            },
            JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        public ActionResult GetLicenseeAgentList(int sRecommend)
        {
            return Json(_commonService.GetLicenseeAgentList(sRecommend), JsonRequestBehavior.AllowGet);
        }

        #endregion Filter

        #region Logs

        [HttpGet]
        public ActionResult Logs()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetReport(GetSettingLogViewModel model)
        {
            return Json(_settingConfigurationService.GetLogs(model), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetLogSettings()
        {
            var licensees = _commonService.GetLicenseeList;
            var superWithCurrencies = _commonService.GetSuperLicenseeList(licensees.FirstOrDefault()?.Name);
            var currentDate = DateTime.Now.ToString("yyyy-MM-dd 00:00:00");

            return Json(new
            {
                CurrentDate = currentDate,
                Licensees = licensees,
                SuperWithCurrencies = superWithCurrencies,
                Agents = _commonService.GetLicenseeAgentList(superWithCurrencies.FirstOrDefault().Id),
                SportNames = new { _commonService.GetGameTypeList.Keys, _commonService.GetGameTypeList.Values }
            }, JsonRequestBehavior.AllowGet);
        }

        #endregion Logs
    }
}