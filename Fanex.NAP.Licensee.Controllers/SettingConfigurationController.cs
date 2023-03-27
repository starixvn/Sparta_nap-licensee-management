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
        /// Edit default bet setting.
        /// </summary>
        /// <param name="productType">Product type.</param>
        /// <returns>Partial view.</returns>
        public PartialViewResult EditDefaultBetSetting(int productType)
        {
            const string rootPath = "BetSetting/";
            switch (productType)
            {
                case SportType.SportBook:
                    return PartialView(rootPath + "EditDBSSportbook");
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
            var superLicensee = _commonService.GetSuperLicenseeList(model.LicenseeName).SingleOrDefault(_ => _.Id == model.CustId);

            if (superLicensee == null)
            {
                return Json("Unknown Default Bet Setting!", JsonRequestBehavior.AllowGet);
            }

            var currencyId = superLicensee.ExchangeId;
            var viewModel = _betSettingService.SingleSetting(new GetSingleDefaultBetSettingCriteria(model.LicenseeName, currencyId, model.AgentId));

            switch (model.ProductTypeId)
            {
                case SportType.SportBook:
                    return Json(viewModel.Sportbook.OrderBy(i => i, new SportComparer()).ToList(), JsonRequestBehavior.AllowGet);
                case SportType.NumberGame:
                    return Json(viewModel.NumberGame.OrderBy(i => i, new SportComparer()).ToList(), JsonRequestBehavior.AllowGet);
                case SportType.Keno:
                    return Json(viewModel.Keno.OrderBy(i => i, new SportComparer()).ToList(), JsonRequestBehavior.AllowGet);
                default:
                    return Json("Unknown Default Bet Setting!", JsonRequestBehavior.AllowGet);
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
                    BSSportbookItemWithSuperInfo sportBookItems = _settingConfigurationService
                                                                    .GetBSSportbookItemWithSuperInfo(settingConfigVM.CustId, settingConfigVM.ProdId, settingConfigVM.AgentId, settingConfigVM.Option);
                    BSSportbookViewModel sportBookVM = new BSSportbookViewModel(sportBookItems, _commonService.GetSportbookGameTypeList);
                    return Json(sportBookVM, JsonRequestBehavior.AllowGet);
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
            var updateItem = new BetSettingSportsbookItem
            {
                CustId = sportbookVM.CustId,
                SportTypeId = sportbookVM.SportBetSetting.SportTypeId,
                BetTypeId = sportbookVM.SportBetSetting.BetTypeId,
                MinBet = Converter.ToDecimal(sportbookVM.SportBetSetting.MinBet),
                MaxBet = Converter.ToDecimal(sportbookVM.SportBetSetting.MaxBet),
                MaxPerMatch = Converter.ToDecimal(sportbookVM.SportBetSetting.MaxPerMatch),
                ExistedMember = sportbookVM.ExistedMember,
                AgentId = sportbookVM.AgentId,
                MaxPayoutPerMatch = Converter.ToDecimal(sportbookVM.SportBetSetting.MaxPayoutPerMatch),
                Option = sportbookVM.Option,
                IsNewMember = sportbookVM.IsNewMember,
                DBSRows = sportbookVM.DBSRows
            };

            ResultInfo result = _settingConfigurationService.UpdateBetSettingSportsbook(updateItem);

            return new JsonResult { Data = new UpdateBSResultViewModel(sportbookVM.SportBetSetting.BetTypeName, result.IsOk, result.Message) };
        }

        [HttpPost]
        public JsonResult CheckBetSettingSportbook(BSSportbookViewModel sportbookVM)
        {
            var updateItem = new BetSettingSportsbookItem
            {
                CustId = sportbookVM.CustId,
                AgentId = sportbookVM.AgentId,
                Option = sportbookVM.Option,
                IsNewMember = sportbookVM.IsNewMember,
                ExistedMember = sportbookVM.ExistedMember,
                DBSRows = sportbookVM.DBSRows,
                BSRows = sportbookVM.BSRows
            };

            ResultInfo result = _settingConfigurationService.CheckBetSettingSportsbook(updateItem);

            return new JsonResult { Data = result };
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
                ExistedMember = numberGameVM.ExistedMember
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
                kenoVM.ExistedMember);

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
            var superLicenseeItems = _commonService.GetSuperLicenseeList(siteName);

            foreach (var item in superLicenseeItems)
            {
                item.Name = $"{item.CurrencyName} ({item.Name})";
            }

            return Json(superLicenseeItems, JsonRequestBehavior.AllowGet);
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