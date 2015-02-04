// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;
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

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult EditPT()
        {
            return PartialView();
        }

        /// <summary>
        /// Get Position taking data.
        /// </summary>
        /// <param name="custId">Customer Id.</param>
        /// <param name="productId">Product Id.</param>
        /// <returns>String return.</returns>
        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetEditPTData(int custId, int productId)
        {
            float curPT;

            if (!float.TryParse(_settingConfigurationService.GetPositionTaking(custId, productId), out curPT))
            {
                curPT = 0;
            }

            EditPTViewModel editPTVm = new EditPTViewModel()
            {
                ProductName = _commonService.GetProductTypeList.Where(n => n.Id == productId).First().Name,
                PositionTakings = _commonService.GetPositionTakingList,
                SelectedPositionTaking = curPT.ToString("0.###")
            };

            return Json(editPTVm, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult ReviewPT()
        {
            return PartialView();
        }

        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult UpdatePT(UpdatePTViewModel updatePTViewModel)
        {
            ResultInfo result = _settingConfigurationService.UpdatePositionTaking(updatePTViewModel.CustId, updatePTViewModel.ProductId, updatePTViewModel.PTValue);

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult EditComm()
        {
            return PartialView();
        }

        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetEditCommData(int custId)
        {
            IList<CommItem> lstCommItems = _settingConfigurationService.GetCommList(custId);
            IList<string> lstComms = _commonService.GetCommList;
            EditCommViewModel editCommVm = new EditCommViewModel(lstCommItems, lstComms);

            return Json(editCommVm.EditCommRows, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult ReviewComm()
        {
            return PartialView();
        }

        /// <summary>
        /// Update commission.
        /// </summary>
        /// <param name="updateCommVM">Update commission view model.</param>
        /// <returns>String result.</returns>
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult UpdateComm(UpdateCommViewModel updateCommVM)
        {
            IList<UpdateCommResultViewModel> lstUpdateResults = new List<UpdateCommResultViewModel>();
            foreach (EditCommRowViewModel item in updateCommVM.CommRows)
            {
                if (item.IsChecked == true)
                {
                    ResultInfo result = _settingConfigurationService.UpdateComm(updateCommVM.CustId, item.SportTypeId, item.BetTypeId, float.Parse(item.SelectedComm));
                    lstUpdateResults.Add(new UpdateCommResultViewModel(item.SportTypeName, item.BetTypeName, result.IsOk, result.Message));
                }
            }

            return PartialView("UpdateCommResult", lstUpdateResults);
        }

        /// <summary>
        /// Edit bet setting.
        /// </summary>
        /// <param name="sportType">Sport type.</param>
        /// <returns>Partial view.</returns>
        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult EditBetSetting(int sportType)
        {
            switch (sportType)
            {
                case 1:
                    return PartialView("EditBSSportbook");
                case 161:
                    return PartialView("EditBSNumberGame");
                case 180:

                    break;
                case 162:

                    break;
                case 202:
                    return PartialView("EditBSKeno");
                case 151:

                    break;
                default:

                    break;
            }

            return PartialView();
        }

        /// <summary>
        /// Get edit setting data.
        /// </summary>
        /// <param name="sportType">Sport type.</param>
        /// <param name="custId">Customer Id.</param>
        /// <param name="productId">Product Id.</param>
        /// <returns>String result.</returns>
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetEditBetSettingData(int sportType, int custId, int productId)
        {
            switch (sportType)
            {
                case 1:
                    return Json("gfg", JsonRequestBehavior.AllowGet);
                case 161:
                    return Json("gfg", JsonRequestBehavior.AllowGet);
                case 180:

                    break;
                case 162:

                    break;
                case 202:
                    IList<BetSettingKenoItem> lstKenoItems = _settingConfigurationService.GetBetSetting<BetSettingKenoItem>(custId, productId);
                    EditBSKenoViewModel kenoVm = new EditBSKenoViewModel(lstKenoItems);
                    return Json(kenoVm.EditBSKenoRows, JsonRequestBehavior.AllowGet);
                case 151:

                    break;
                default:

                    break;
            }

            return Json("gf", JsonRequestBehavior.AllowGet);
        }

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
    }
}