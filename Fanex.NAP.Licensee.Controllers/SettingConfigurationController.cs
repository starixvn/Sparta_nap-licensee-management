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
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration;
    using Fanex.NAP.Licensee.Service;
    using ONEbook.UM.Filters;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;
    using System.Collections.Generic;

    /// <summary>
    /// Setting Configuration Controller.
    /// </summary>
    [CustomHandleError]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Host)]
    [CheckUMFilter]
    public class SettingConfigurationController : BaseController
    {
        private const int DBSErrorCode = 103;

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
            updateItem.UpdNewMember = updateItem.ToXmlSetting(sportsbookVM.DBSRows);
            updateItem.UpdBetLimit = updateItem.ToXmlSetting(Enumerable.Repeat(sportsbookVM.SportBetSetting, 1));
            updateItem.UserId = CurrentSession.UserId;
            updateItem.IP = Request.UserHostAddress;

            ResultInfo result = _settingConfigurationService.UpdateBetSettingSportsbook(updateItem);

            return new JsonResult { Data = new BSResultViewModel(sportsbookVM.SportBetSetting.BetTypeName, result.IsOk, result.Message) };
        }

        [HttpPost]
        public JsonResult CheckBetSettingSportsbook(BSSportsbookViewModel sportsbookVM)
        {
            var updateItem = new CheckBetSettingSportsbookItem();
            var dbsViolatedItems = new List<CheckBSResultViewModel>();

            FormatBetSettingSportsbookItem(updateItem, sportsbookVM);
            updateItem.UpdNewMember = updateItem.ToXmlSetting(sportsbookVM.DBSRows);

            foreach (var item in sportsbookVM.BSRows)
            {
                updateItem.UpdBetLimit = updateItem.ToXmlSetting(Enumerable.Repeat(item, 1));
                var result = _settingConfigurationService.CheckBetSettingSportsbook(updateItem);

                if (!result.IsOk)
                {
                    if (result.Code == DBSErrorCode)
                    {
                        dbsViolatedItems.Add(new CheckBSResultViewModel(item.BetTypeName, result.IsOk, result.Message, result.Code));
                    }
                    else
                    {
                        return new JsonResult { Data = new CheckBSResultViewModel(item.BetTypeName, result.IsOk, result.Message, result.Code) };
                    }
                }
            }

            return dbsViolatedItems.Count != 0 ? new JsonResult { Data = dbsViolatedItems[0] }
                                               : new JsonResult { Data = new CheckBSResultViewModel(string.Empty, true, string.Empty, 0) };
        }

        public void FormatBetSettingSportsbookItem(BetSettingSportsbookItemBase updateItem, BSSportsbookViewModel sportsbookVM)
        {
            updateItem.CustId = sportsbookVM.CustId;
            updateItem.ExistedMember = sportsbookVM.ExistedMember;
            updateItem.AgentId = sportsbookVM.AgentId;
            updateItem.Option = sportsbookVM.Option;
            updateItem.IsNewMember = sportsbookVM.IsNewMember;
        }

        #endregion

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
        #endregion
    }
}