// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.Common;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.ViewModel;
    using Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration;
    using Fanex.NAP.Licensee.Service;

    /// <summary>
    /// Setting Configuration Controller.
    /// </summary>
    [CustomHandleError]
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

        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        #region PT

        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult EditPT()
        {
            return PartialView("PT/EditPT");
        }

        /// <summary>
        /// Get Position taking data.
        /// </summary>
        /// <param name="settingConfigVM">Setting configuration view model.</param>
        /// <returns>String return.</returns>
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
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

        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult ReviewPT()
        {
            return PartialView("PT/ReviewPT");
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult UpdatePT(UpdatePTViewModel updatePTViewModel)
        {
            ResultInfo result = _settingConfigurationService.UpdatePositionTaking(updatePTViewModel.CustId, updatePTViewModel.ProductId, updatePTViewModel.PTValue);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Comm

        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult EditComm()
        {
            return PartialView("Comm/EditComm");
        }

        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetEditCommData(int custId)
        {
            IList<CommItem> lstCommItems = _settingConfigurationService.GetCommList(custId);
            IList<string> lstComms = _commonService.GetCommList;
            CommViewModel editCommVm = new CommViewModel(lstCommItems, lstComms);

            return Json(editCommVm.EditCommRows, JsonRequestBehavior.AllowGet);
        }

        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult ReviewComm()
        {
            return PartialView("Comm/ReviewComm");
        }

        /// <summary>
        /// Update commission.
        /// </summary>
        /// <param name="updateCommVM">Update commission view model.</param>
        /// <returns>String result.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult UpdateComm(UpdateCommViewModel updateCommVM)
        {
            IList<UpdateCommResultViewModel> lstUpdateResults = new List<UpdateCommResultViewModel>();
            foreach (CommRowViewModel item in updateCommVM.CommRows)
            {
                if (item.IsChecked == true)
                {
                    ResultInfo result = _settingConfigurationService.UpdateComm(updateCommVM.CustId, item.SportTypeId, item.BetTypeId, float.Parse(item.SelectedComm));
                    lstUpdateResults.Add(new UpdateCommResultViewModel(item.SportTypeName, item.BetTypeName, result.IsOk, result.Message));
                }
            }

            return PartialView("Comm/UpdateCommResult", lstUpdateResults);
        }

        #endregion

        #region Bet setting

        /// <summary>
        /// Edit bet setting.
        /// </summary>
        /// <param name="sportType">Sport type.</param>
        /// <returns>Partial view.</returns>
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult EditBetSetting(int sportType)
        {
            string rootPath = "BetSetting/";
            switch (sportType)
            {
                case SportType.SportBook:
                    return PartialView(rootPath + "EditBSSportbook");
                case SportType.Racing:
                    return PartialView(rootPath + "EditBSRacing");
                case SportType.NumberGame:
                    return PartialView(rootPath + "EditBSNumberGame");
                case SportType.VirtualSport:
                    return PartialView(rootPath + "EditBSVirtualSport");
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetEditBetSettingData(SettingConfigFilterViewModel settingConfigVM)
        {
            switch (settingConfigVM.ProdId)
            {
                case SportType.SportBook:
                    IList<BSSportbookItem> lstSportbookItems = _settingConfigurationService.GetBetSetting<BSSportbookItem>(settingConfigVM.CustId, settingConfigVM.ProdId);
                    BSSportbookViewModel sportBookVM = new BSSportbookViewModel(lstSportbookItems, _commonService.GetSportbookGameTypeList);
                    return Json(sportBookVM, JsonRequestBehavior.AllowGet);
                case SportType.Racing:
                    IList<BSRacingItem> lstRacingItems = _settingConfigurationService.GetBetSetting<BSRacingItem>(settingConfigVM.CustId, settingConfigVM.ProdId);
                    BSRacingViewModel racingVM = new BSRacingViewModel(lstRacingItems, _commonService.GetRacingGameTypeList);
                    return Json(racingVM, JsonRequestBehavior.AllowGet);
                case SportType.NumberGame:
                    IList<BSNumberGameItem> lstNumberGameItems = _settingConfigurationService.GetBetSetting<BSNumberGameItem>(settingConfigVM.CustId, settingConfigVM.ProdId);
                    BSNumberGameViewModel numberGameVM = new BSNumberGameViewModel(lstNumberGameItems, _commonService.GetNumberGameTypeList);
                    return Json(numberGameVM, JsonRequestBehavior.AllowGet);
                case SportType.VirtualSport:
                    IList<BSVirtualSportItem> lstVirtualSportItems = _settingConfigurationService.GetBetSetting<BSVirtualSportItem>(settingConfigVM.CustId, settingConfigVM.ProdId);
                    BSVirtualSportViewModel virtualSportVM = new BSVirtualSportViewModel(lstVirtualSportItems, _commonService.GetVirtualSportGameTypeList);
                    return Json(virtualSportVM, JsonRequestBehavior.AllowGet);
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult ReviewBetSetting(int sportType)
        {
            string rootPath = "BetSetting/";
            switch (sportType)
            {
                case SportType.SportBook:
                    return PartialView(rootPath + "ReviewBSSportbook");
                case SportType.Racing:
                    return PartialView(rootPath + "ReviewBSRacing");
                case SportType.NumberGame:
                    return PartialView(rootPath + "ReviewBSNumberGame");
                case SportType.VirtualSport:
                    return PartialView(rootPath + "ReviewBSVirtualSport");
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult UpdateBetSettingSportbook(BSSportbookViewModel sportbookVM)
        {
            IList<UpdateBSResultViewModel> lstUpdateResults = new List<UpdateBSResultViewModel>();

            foreach (var item in sportbookVM.BSRows)
            {
                if (item.IsRowSelected == true)
                {
                    UpdateBetSettingItem updItem = new UpdateBetSettingItem(
                        sportbookVM.CustId,
                        item.SportTypeId,
                        item.BetTypeId,
                        Converter.ToDecimal(item.MinBet),
                        Converter.ToDecimal(item.MaxBet),
                        Converter.ToDecimal(item.MaxPerMatch),
                        sportbookVM.IsApplyExistingMemberChecked);

                    ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);
                    lstUpdateResults.Add(new UpdateBSResultViewModel(item.BetTypeName, result.IsOk, result.Message));
                }
            }

            return PartialView("BetSetting/UpdateBSResult", lstUpdateResults);
        }

        /// <summary>
        /// Review bet setting number game.
        /// </summary>
        /// <param name="numberGameVM">Bet setting number game view model.</param>
        /// <returns>Partial view.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult UpdateBetSettingNumberGame(BSNumberGameViewModel numberGameVM)
        {
            IList<UpdateBSResultViewModel> lstUpdateResults = new List<UpdateBSResultViewModel>();

            foreach (var item in numberGameVM.BSRows)
            {
                UpdateBetSettingItem updItem = new UpdateBetSettingItem();
                updItem.CustId = numberGameVM.CustId;
                updItem.SportType = numberGameVM.ProdId;
                updItem.MinBet = Converter.ToDecimal(item.MinBet);
                updItem.MaxBet = Converter.ToDecimal(item.MaxBet);
                updItem.MaxPerMatch = Converter.ToDecimal(item.MaxPerMatch);
                updItem.MaxPerBall = Converter.ToDecimal(item.MaxPerBall);
                updItem.ExistedMember = numberGameVM.IsApplyExistingMemberChecked;

                ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);
                lstUpdateResults.Add(new UpdateBSResultViewModel("Number Game", result.IsOk, result.Message));
            }

            return PartialView("BetSetting/UpdateBSResult", lstUpdateResults);
        }

        /// <summary>
        /// Update bet setting virtual sport.
        /// </summary>
        /// <param name="virtualSportVM">Bet setting virtual sport view model.</param>
        /// <returns>Partial view.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult UpdateBetSettingVirtualSport(BSVirtualSportViewModel virtualSportVM)
        {
            IList<UpdateBSResultViewModel> lstUpdateResults = new List<UpdateBSResultViewModel>();

            foreach (var item in virtualSportVM.BSRows)
            {
                if (item.IsRowSelected == true)
                {
                    UpdateBetSettingItem updItem = new UpdateBetSettingItem(
                        virtualSportVM.CustId,
                        item.SportTypeId,
                        item.BetTypeId,
                        Converter.ToDecimal(item.MinBet),
                        Converter.ToDecimal(item.MaxBet),
                        Converter.ToDecimal(item.MaxPerMatch),
                        virtualSportVM.IsEnableChecked,
                        virtualSportVM.IsDownlineChecked,
                        virtualSportVM.IsApplyExistingMemberChecked);

                    ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);
                    lstUpdateResults.Add(new UpdateBSResultViewModel(item.SportTypeName, result.IsOk, result.Message));
                }
            }

            return PartialView("BetSetting/UpdateBSResult", lstUpdateResults);
        }

        /// <summary>
        /// Update bet setting racing.
        /// </summary>
        /// <param name="racingVM">Bet setting racing view model.</param>
        /// <returns>Partial view.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult UpdateBetSettingRacing(BSRacingViewModel racingVM)
        {
            IList<UpdateBSResultViewModel> lstUpdateResults = new List<UpdateBSResultViewModel>();

            foreach (var item in racingVM.BSRows)
            {
                if (item.IsRowSelected == true)
                {
                    UpdateBetSettingItem updItem = new UpdateBetSettingItem(
                        racingVM.CustId,
                        item.SportTypeId,
                        item.BetTypeId,
                        Converter.ToDecimal(item.MinBet),
                        Converter.ToDecimal(item.MaxBet),
                        Converter.ToDecimal(item.MaxPerMatch),
                        item.IsSuperChecked,
                        item.IsDownlineChecked,
                        racingVM.IsApplyExistingMemberChecked);

                    ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);
                    lstUpdateResults.Add(new UpdateBSResultViewModel(item.BetTypeName.Replace(";", " / "), result.IsOk, result.Message));
                }
            }

            return PartialView("BetSetting/UpdateBSResult", lstUpdateResults);
        }

        /// <summary>
        /// Review bet setting.
        /// </summary>
        /// <param name="kenoVM">Bet setting keno view model.</param>
        /// <returns>Partial view.</returns>
        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult UpdateBetSettingKeno(BSKenoViewModel kenoVM)
        {
            IList<UpdateBSResultViewModel> lstUpdateResults = new List<UpdateBSResultViewModel>();

            foreach (var item in kenoVM.BSRows)
            {
                if (item.IsRowSelected == true)
                {
                    UpdateBetSettingItem updItem = new UpdateBetSettingItem(
                        kenoVM.CustId,
                        item.SportTypeId,
                        item.BetTypeId,
                        Converter.ToDecimal(item.MinBet),
                        Converter.ToDecimal(item.MaxBet),
                        Converter.ToDecimal(item.MaxPerMatch),
                        item.IsSuperChecked,
                        item.IsDownlineChecked,
                        kenoVM.IsApplyExistingMemberChecked);

                    ResultInfo result = _settingConfigurationService.UpdateBetSetting(updItem);
                    lstUpdateResults.Add(new UpdateBSResultViewModel(item.BetTypeName, result.IsOk, result.Message));
                }
            }

            return PartialView("BetSetting/UpdateBSResult", lstUpdateResults);
        }

        #endregion

        #region Filter

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeList()
        {
            return Json(_commonService.GetLicenseeList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetSuperLicenseeList(string siteName)
        {
            IList<LicenseeItem> lstLicenseeSuper = _commonService.GetSuperLicenseeList(siteName);
            return Json(lstLicenseeSuper, JsonRequestBehavior.AllowGet);
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Reviewed")]
        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetProductTypeList()
        {
            IList<ProductTypeItem> dctProductTypes = _commonService.GetProductTypeList;
            return Json(dctProductTypes, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}