// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.Common;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration;
    using Fanex.NAP.Licensee.Service;
    using ONEbook.UM.Filters;

    /// <summary>
    /// Setting Configuration Controller.
    /// </summary>
    [CustomHandleError]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Host)]
    [CheckUMFilter]
    public class SettingConfigurationController : BaseController
    {
        private readonly ICommonService _commonService;
        private readonly ISettingConfigurationService _settingConfigurationService;

        public SettingConfigurationController()
            : base()
        {
            _commonService = new CommonService();
            _settingConfigurationService = new SettingConfigurationService();
        }

        public SettingConfigurationController(ICommonService commonService, ISettingConfigurationService settingConfigurationService)
        {
            _commonService = commonService;
            _settingConfigurationService = settingConfigurationService;
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
                SelectedPositionTaking = curPT.ToString("0.###")
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

        /// <summary>
        /// Edit bet setting.
        /// </summary>
        /// <param name="sportType">Sport type.</param>
        /// <returns>Partial view.</returns>
        public PartialViewResult EditBetSetting(int sportType)
        {
            string rootPath = "BetSetting/";
            switch (sportType)
            {
                case SportType.SportBook:
                    return PartialView(rootPath + "EditBSSportbook");
                case SportType.NumberGame:
                    return PartialView(rootPath + "EditBSNumberGame");
                case SportType.Keno:
                    return PartialView(rootPath + "EditBSKeno");
                default:
                    return PartialView(rootPath + "UnsupportedFunction");
            }
        }

        /// <summary>
        /// Get edit setting data.
        /// </summary>
        /// <param name="settingConfigVM">Setting config filter view model.</param>
        /// <returns>String result.</returns>
        public JsonResult GetEditBetSettingData(SettingConfigFilterViewModel settingConfigVM)
        {
            switch (settingConfigVM.ProdId)
            {
                case SportType.SportBook:
                    IList<BSSportbookItem> lstSportbookItems = _settingConfigurationService.GetBetSetting<BSSportbookItem>(settingConfigVM.CustId, settingConfigVM.ProdId);
                    BSSportbookViewModel sportBookVM = new BSSportbookViewModel(lstSportbookItems, _commonService.GetSportbookGameTypeList);
                    return Json(sportBookVM, JsonRequestBehavior.AllowGet);
                case SportType.NumberGame:
                    IList<BSNumberGameItem> lstNumberGameItems = _settingConfigurationService.GetBetSetting<BSNumberGameItem>(settingConfigVM.CustId, settingConfigVM.ProdId);
                    BSNumberGameViewModel numberGameVM = new BSNumberGameViewModel(lstNumberGameItems, _commonService.GetNumberGameTypeList);
                    return Json(numberGameVM, JsonRequestBehavior.AllowGet);
                case SportType.Keno:
                    IList<BSKenoItem> lstKenoItems = _settingConfigurationService.GetBetSetting<BSKenoItem>(settingConfigVM.CustId, settingConfigVM.ProdId);
                    BSKenoViewModel kenoVm = new BSKenoViewModel(lstKenoItems, _commonService.GetKenoGameTypeList);
                    return Json(kenoVm, JsonRequestBehavior.AllowGet);
                default:
                    return Json("Unknown Bet Setting!", JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Review bet setting.
        /// </summary>
        /// <param name="sportType">Sport type.</param>
        /// <returns>Partial view.</returns>
        public PartialViewResult ReviewBetSetting(int sportType)
        {
            string rootPath = "BetSetting/";
            switch (sportType)
            {
                case SportType.SportBook:
                    return PartialView(rootPath + "ReviewBSSportbook");
                case SportType.NumberGame:
                    return PartialView(rootPath + "ReviewBSNumberGame");
                case SportType.Keno:
                    return PartialView(rootPath + "ReviewBSKeno");
                default:
                    return PartialView(rootPath + "UnsupportedFunction");
            }
        }

        /// <summary>
        /// Update bet setting sport book.
        /// </summary>
        /// <param name="sportbookVM">Bet setting sport book view model.</param>
        /// <returns>Partial view.</returns>
        [HttpPost]
        public JsonResult UpdateBetSettingSportbook(BSSportbookViewModel sportbookVM)
        {
            var updItem = new UpdateBetSettingItem(
                sportbookVM.CustId,
                sportbookVM.SportBetSetting.SportTypeId,
                sportbookVM.SportBetSetting.BetTypeId,
                Converter.ToDecimal(sportbookVM.SportBetSetting.MinBet),
                Converter.ToDecimal(sportbookVM.SportBetSetting.MaxBet),
                Converter.ToDecimal(sportbookVM.SportBetSetting.MaxPerMatch),
                sportbookVM.IsApplyExistingMemberChecked);

            ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);

            return new JsonResult { Data = new UpdateBSResultViewModel(sportbookVM.SportBetSetting.BetTypeName, result.IsOk, result.Message) };
        }

        /// <summary>
        /// Review bet setting number game.
        /// </summary>
        /// <param name="numberGameVM">Bet setting number game view model.</param>
        /// <returns>Partial view.</returns>
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
                ExistedMember = numberGameVM.IsApplyExistingMemberChecked
            };

            ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);

            return new JsonResult { Data = new UpdateBSResultViewModel(numberGameVM.SportBetSetting.BetTypeName, result.IsOk, result.Message) };
        }

        /// <summary>
        /// Review bet setting.
        /// </summary>
        /// <param name="kenoVM">Bet setting keno view model.</param>
        /// <returns>Partial view.</returns>
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
                kenoVM.IsApplyExistingMemberChecked);

            ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);

            return new JsonResult { Data = new UpdateBSResultViewModel(kenoVM.SportBetSetting.BetTypeName, result.IsOk, result.Message) };
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
                ProductTypeList = _commonService.GetProductTypeList
            },
            JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}