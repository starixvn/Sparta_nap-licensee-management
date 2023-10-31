namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.NAP.Core.Business;
    using Fanex.NAP.Core.Web.Attribute;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using Fanex.NAP.Licensee.Model.Comparer;
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.ViewModel.LicenseeBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.Log;
    using Fanex.NAP.Licensee.Service;
    using ONEbook.UM.Filters;

    [NapSuperAuth]
    [CustomHandleError]
    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.LicenseeBetSetting, Policy = Constant.Policy.Host)]
    [CheckUMFilter]
    public class LicenseeBetSettingController : BaseController
    {
        private readonly ICommonService _commonService;
        private readonly ILicenseeBetSettingService _licenseeBetSettingService;
        private readonly IDefaultBetSettingService _betSettingService;

        public LicenseeBetSettingController()
        {
            _commonService = new CommonService();
            _licenseeBetSettingService = new LicenseeBetSettingService();
            _betSettingService = new DefaultBetSettingService();
        }

        public LicenseeBetSettingController(
            ICommonService commonService,
            ILicenseeBetSettingService licenseeBetSettingService,
            IDefaultBetSettingService betSettingService)
        {
            _commonService = commonService;
            _licenseeBetSettingService = licenseeBetSettingService;
            _betSettingService = betSettingService;
        }

        public ActionResult Index()
        {
            return View();
        }

        #region Bet setting

        public PartialViewResult EditDefaultBetSetting(int productTypeId)
        {
            const string rootPath = "BetSetting/";
            return productTypeId == ProductTypeId.SportsBook
                ? PartialView(rootPath + "EditDBSSportsbook")
                : PartialView("../Error/UnsupportedFunction");
        }

        public JsonResult GetDefaultBetSetting(GetDefaultBetSettingViewModel model)
        {
            if (model.CurrencyId == -1 || model.LicenseeName == null)
            {
                return Json("Can't get Default Bet Setting!", JsonRequestBehavior.AllowGet);
            }

            if (model.ProductTypeId != ProductTypeId.SportsBook)
            {
                return Json("Unknown Default Bet Setting!", JsonRequestBehavior.AllowGet);
            }

            var dbsItems = _betSettingService.SingleSetting(new GetSingleDefaultBetSettingCriteria(model.LicenseeName, model.CurrencyId, model.AgentId));
            var dbsSportsbookItems = dbsItems.Sportsbook.OrderBy(i => i, new SportComparer()).ToList();

            return Json(new BSSportsbookViewModel(dbsSportsbookItems), JsonRequestBehavior.AllowGet);
        }

        public PartialViewResult EditBetSetting(int productTypeId)
        {
            const string rootPath = "BetSetting/";

            return productTypeId == ProductTypeId.SportsBook
                ? PartialView(rootPath + "EditBSSportsbook")
                : PartialView("../Error/UnsupportedFunction");
        }

        public JsonResult GetEditBetSettingData(LicenseeBetSettingFilterViewModel model)
        {
            if (model.ProductTypeId != ProductTypeId.SportsBook)
            {
                return Json("Unknown Bet Setting!", JsonRequestBehavior.AllowGet);
            }

            var sportsBookItems = _licenseeBetSettingService.GetBSSportsbookItemWithSuperInfo(model);
            var sportsBookVm = new BSSportsbookViewModel(sportsBookItems, _commonService.GetSportsbookGameTypeList);

            return Json(sportsBookVm, JsonRequestBehavior.AllowGet);
        }

        public PartialViewResult ReviewBetSetting(int productTypeId)
        {
            const string rootPath = "BetSetting/";

            return productTypeId == ProductTypeId.SportsBook
                ? PartialView(rootPath + "ReviewBSSportsbook")
                : PartialView("../Error/UnsupportedFunction");
        }

        [HttpPost]
        public JsonResult UpdateBetSettingSportsbook(BSSportsbookViewModel model)
        {
            model.UserId = CurrentSession.UserId;
            model.IP = Request.UserHostAddress;
            var result = _licenseeBetSettingService.UpdateBetSettingSportsbook(model);

            return Json(result);
        }

        [HttpPost]
        public JsonResult CheckBetSettingSportsbook(BSSportsbookViewModel model)
        {
            var violatedResultItems = _licenseeBetSettingService.CheckBetSettingSportsbook(model);

            return violatedResultItems.Count == 0
                ? Json(new BSResultViewModel())
                : Json(violatedResultItems[0]);
        }

        #endregion Bet setting

        #region Filter

        [HttpGet]
        [AjaxRequest]
        public JsonResult GetLicenseeList()
        {
            return Json(_commonService.GetLicenseeList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        public JsonResult GetSuperLicenseeList(string siteName)
        {
            return Json(_commonService.GetSuperLicenseeList(siteName), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        public JsonResult GetProductTypeList()
        {
            return Json(_commonService.GetProductTypeList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        public JsonResult GetSettings()
        {
            return Json(
            new
            {
                LicenseeList = _commonService.GetLicenseeList,
                ProductTypeList = _commonService.GetProductTypeList
            },
            JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxRequest]
        public JsonResult GetLicenseeAgentList(int sRecommend)
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
            return Json(_licenseeBetSettingService.GetLogs(model), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetLogSettings()
        {
            var currentDate = DateTime.Now.ToString("yyyy-MM-dd 00:00:00");

            return Json(new
            {
                Licensees = _commonService.GetLicenseeList,
                CurrentDate = currentDate,
                SportNames = new { _commonService.GetGameTypeList.Keys, _commonService.GetGameTypeList.Values }
            }, JsonRequestBehavior.AllowGet);
        }

        #endregion Logs
    }
}