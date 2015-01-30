// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationController.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.ViewModel;
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
            float curPT = 0;
            float.TryParse(_settingConfigurationService.GetPositionTaking(custId, productId), out curPT);

            EditPTViewModel editPTVm = new EditPTViewModel()
            {
                ProductName = _commonService.GetProductTypeList().Where(n => n.Id == productId).First().Name,
                PositionTakings = _commonService.GetPositionTakingList(),
                SelectedPositionTaking = curPT.ToString("0.###")
            };

            return Json(editPTVm, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult EditComm()
        {
            return PartialView();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult ReviewComm()
        {
            return PartialView();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public PartialViewResult ReviewPT()
        {
            return PartialView();
        }

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

        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SettingConfiguration, Policy = Constant.Policy.Read)]
        public JsonResult GetProductTypeList()
        {
            IList<ProductTypeItem> dctProductTypes = _commonService.GetProductTypeList();
            return Json(dctProductTypes, JsonRequestBehavior.AllowGet);
        }
    }
}