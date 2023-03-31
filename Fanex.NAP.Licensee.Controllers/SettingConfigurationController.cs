// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using Fanex.Common;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.Comparer;
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration;
    using Fanex.NAP.Licensee.Service;
    using ONEbook.UM.Filters;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;

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

        #region PT
        public PartialViewResult EditPT()
        {
            return PartialView("PT/EditPT");
        }

        /// <summary>
        /// Get Position taking data.
        /// </summary>
        /// <param name="settingConfigVM">Setting configuration view model.</param>
        /// <returns>String return.</returns>
        public JsonResult GetEditPTData(SettingConfigFilterViewModel settingConfigVM)
        {
            string value = _settingConfigurationService.GetPositionTaking(settingConfigVM.CustId, settingConfigVM.ProdId);

            float curPT = string.IsNullOrEmpty(value) ? -1 : float.Parse(value);

            PTViewModel editPTVm = new PTViewModel()
            {
                ProductName = _commonService.GetProductTypeList.Where(n => n.Id == settingConfigVM.ProdId).First().Name,
                PositionTakings = _commonService.GetPositionTakingList,
                SelectedPositionTaking = curPT.ToString("0.####")
            };

            return Json(editPTVm, JsonRequestBehavior.AllowGet);
        }

        public PartialViewResult ReviewPT()
        {
            return PartialView("PT/ReviewPT");
        }

        [HttpPost]
        public JsonResult UpdatePT(UpdatePTViewModel updatePTViewModel)
        {
            ResultInfo result = _settingConfigurationService.UpdatePositionTaking(updatePTViewModel.CustId, updatePTViewModel.ProductId, updatePTViewModel.PTValue);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Bet setting

        public PartialViewResult EditBetSetting(int sportType)
        {
            const string rootPath = "BetSetting/";
            switch (sportType)
            {
                case SportType.SportsBook:
                    return PartialView(rootPath + "EditBSSportsbook");

                case SportType.NumberGame:
                    return PartialView(rootPath + "EditBSNumberGame");

                case SportType.Keno:
                    return PartialView(rootPath + "EditBSKeno");

                default:
                    return PartialView(rootPath + "UnsupportedFunction");
            }
        }

        public PartialViewResult EditDefaultBetSetting(int productType)
        {
            const string rootPath = "BetSetting/";
            switch (productType)
            {
                case SportType.SportsBook:
                    return PartialView(rootPath + "EditDBSSportsbook");

                case SportType.NumberGame:
                    return PartialView(rootPath + "EditDBSNumberGame");

                case SportType.Keno:
                    return PartialView(rootPath + "EditDBSKeno");

                default:
                    return PartialView(rootPath + "UnsupportedFunction");
            }
        }

        public JsonResult GetDefaultBetSetting(GetDefaultBetSettingViewModel model)
        {
            if (model.CurrencyId == -1 || model.LicenseeName == null)
            {
                return Json("Can't get Default Bet Setting!", JsonRequestBehavior.AllowGet);
            }

            var dbsItems = _betSettingService.SingleSetting(new GetSingleDefaultBetSettingCriteria(model.LicenseeName, model.CurrencyId, model.AgentId));

            switch (model.ProductTypeId)
            {
                case SportType.SportsBook:
                    var dbsSportsbookItems = dbsItems.Sportsbook.OrderBy(i => i, new SportComparer()).ToList();
                    return Json(new BSSportsbookViewModel(dbsSportsbookItems), JsonRequestBehavior.AllowGet);

                case SportType.NumberGame:
                    return Json(dbsItems.NumberGame.OrderBy(i => i, new SportComparer()).ToList(), JsonRequestBehavior.AllowGet);

                case SportType.Keno:
                    return Json(dbsItems.Keno.OrderBy(i => i, new SportComparer()).ToList(), JsonRequestBehavior.AllowGet);

                default:
                    return Json("Unknown Default Bet Setting!", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetEditBetSettingData(SettingConfigFilterViewModel settingConfigVM)
        {
            switch (settingConfigVM.ProdId)
            {
                case SportType.SportsBook:
                    BSSportsbookItemWithSuperInfo sportsBookItems = _settingConfigurationService
                                                                    .GetBSSportsbookItemWithSuperInfo(settingConfigVM.CustId, settingConfigVM.ProdId, settingConfigVM.AgentId, settingConfigVM.Option);
                    BSSportsbookViewModel sportsBookVM = new BSSportsbookViewModel(sportsBookItems, _commonService.GetSportsbookGameTypeList);
                    return Json(sportsBookVM, JsonRequestBehavior.AllowGet);

                case SportType.NumberGame:
                    IList<BSNumberGameItem> lstNumberGameItems = _settingConfigurationService.GetBetSetting<BSNumberGameItem>(settingConfigVM.CustId, settingConfigVM.ProdId, settingConfigVM.AgentId);
                    BSNumberGameViewModel numberGameVM = new BSNumberGameViewModel(lstNumberGameItems, _commonService.GetNumberGameTypeList);
                    return Json(numberGameVM, JsonRequestBehavior.AllowGet);

                case SportType.Keno:
                    IList<BSKenoItem> lstKenoItems = _settingConfigurationService.GetBetSetting<BSKenoItem>(settingConfigVM.CustId, settingConfigVM.ProdId, settingConfigVM.AgentId);
                    BSKenoViewModel kenoVm = new BSKenoViewModel(lstKenoItems, _commonService.GetKenoGameTypeList);
                    return Json(kenoVm, JsonRequestBehavior.AllowGet);

                default:
                    return Json("Unknown Bet Setting!", JsonRequestBehavior.AllowGet);
            }
        }

        public PartialViewResult ReviewBetSetting(int sportType)
        {
            const string rootPath = "BetSetting/";
            switch (sportType)
            {
                case SportType.SportsBook:
                    return PartialView(rootPath + "ReviewBSSportsbook");

                case SportType.NumberGame:
                    return PartialView(rootPath + "ReviewBSNumberGame");

                case SportType.Keno:
                    return PartialView(rootPath + "ReviewBSKeno");

                default:
                    return PartialView(rootPath + "UnsupportedFunction");
            }
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

        [HttpPost]
        public JsonResult UpdateBetSettingNumberGame(BSNumberGameViewModel numberGameVM)
        {
            var updItem = new UpdateBetSettingItem
            {
                CustId = numberGameVM.CustId,
                SportType = numberGameVM.ProdId,
                MinBet = Converter.ToDecimal(numberGameVM.SportBetSetting.MinBet),
                MaxBet = Converter.ToDecimal(numberGameVM.SportBetSetting.MaxBet),
                MaxPerMatch = Converter.ToDecimal(numberGameVM.SportBetSetting.MaxPerMatch),
                MaxPerBall = Converter.ToDecimal(numberGameVM.SportBetSetting.MaxPerBall),
                ExistedMember = numberGameVM.ExistedMember
            };

            ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);

            return new JsonResult { Data = new BSResultViewModel(numberGameVM.SportBetSetting.BetTypeName, result.IsOk, result.Message) };
        }

        [HttpPost]
        public JsonResult UpdateBetSettingKeno(BSKenoViewModel kenoVM)
        {
            var updItem = new UpdateBetSettingItem(
                kenoVM.CustId,
                kenoVM.SportBetSetting.SportTypeId,
                kenoVM.SportBetSetting.BetTypeId,
                Converter.ToDecimal(kenoVM.SportBetSetting.MinBet),
                Converter.ToDecimal(kenoVM.SportBetSetting.MaxBet),
                Converter.ToDecimal(kenoVM.SportBetSetting.MaxPerMatch),
                kenoVM.IsEnableChecked,
                kenoVM.IsDownlineChecked,
                kenoVM.ExistedMember);

            ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);

            return new JsonResult { Data = new BSResultViewModel(kenoVM.SportBetSetting.BetTypeName, result.IsOk, result.Message) };
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