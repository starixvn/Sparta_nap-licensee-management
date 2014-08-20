using System.Web.Mvc;
using Fanex.NAP.Core.Business;
using Fanex.NAP.Core.Web.Attribute;
using Fanex.NAP.Licensee.Model.Criteria;
using Fanex.NAP.Licensee.Model.DataDomain;

namespace Fanex.NAP.Licensee.Controllers
{
    public class BetSettingController : Controller
    {
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
    }
}