namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Attributes;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Service;

    public class BetSettingController : BaseController
    {
        private readonly ICommonService _commonService;

        public BetSettingController()
            : base()
        {
            this._commonService = new CommonService();
        }

        //
        // GET: /BetSetting/

        #region Load default bet setting

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult Default()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Host)]
        public ActionResult Default(DefaultBetSettingCriteria criteria)
        {
            return View();
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
        public ActionResult AddNew(EditingBetSettingCriteria criteria)
        {
            return View();
        }

        #endregion Add New

        #region Editting

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult Edit(int siteId, int currencyId, int agentId)
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.EditDefaultBetSetting, Policy = Constant.Policy.Host)]
        public ActionResult Edit(EditingBetSettingCriteria criteria)
        {
            return View();
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ViewLogs, Policy = Constant.Policy.Host)]
        public ActionResult Logs(ViewLogCriteria criteria)
        {
            return View();
        }

        #endregion Logs

        #region CommonFunction

        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult GetCurrencyList()
        {
            return Json(_commonService.GetCurrencyList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.DefaultBetSetting, Policy = Constant.Policy.Read)]
        public ActionResult GetLicenseeList()
        {
            return Json(_commonService.GetLicenseeList, JsonRequestBehavior.AllowGet);
        }

        #endregion CommonFunction
    }
}