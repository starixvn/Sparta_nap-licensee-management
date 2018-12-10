namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web.Hosting;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.SourceLicenseeSetting;
    using Model.DataDomain;
    using Model.DTO;
    using Model.ViewModel.SourceLicenseeSetting;
    using Newtonsoft.Json;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    public class SourceLicenseeSettingController : BaseController
    {
        private readonly ISourceLicenseeSettingService _service;

        private readonly ICommonService _commonService;

        public SourceLicenseeSettingController()
        {
            _service = new SourceLicenseeSettingService();
            _commonService = new CommonService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SourceLicenseeSetting, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View(GetSearchViewModel());
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SourceLicenseeSetting, Policy = Constant.Policy.Read)]
        public JsonResult Search(SearchSourceLicenseeCriteria criteria)
        {
            var result = _service.Search(criteria);
            return Json(result);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SourceLicenseeSetting, Policy = Constant.Policy.Host)]
        public ActionResult Add()
        {
            return View(GetSearchViewModel());
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SourceLicenseeSetting, Policy = Constant.Policy.Host)]
        public JsonResult GetSourceData(SearchSourceLicenseeCriteria criteria)
        {
            var result = _service.Search(criteria, "Nap_LM_SourceLicensee_GetSourceData");
            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.SourceLicenseeSetting, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeCurrencyList(int licenseeId)
        {
            var result = _commonService.GetLicenseeCurrencyList(licenseeId);
            return Json(result);
        }

        private SearchSourceLicenseeViewModel GetSearchViewModel()
        {
            var fakeLicensee = GetFakeLicensees();
            var siteNames = _commonService.GetLicenseeList;

            return new SearchSourceLicenseeViewModel
            {
                CurrencyList = _commonService.GetCurrencyList,
                SiteNameList = siteNames.Where(x => fakeLicensee.Contains(x.Name)),
                SourceSiteNameList = siteNames,
                RoleList = GetRoleList()
            };
        }

        private IDictionary<int, string> GetRoleList()
        {
            return new Dictionary<int, string>
            {
                { (int)RoleType.Agent, RoleType.Agent.ToString() },
                { (int)RoleType.Menber, RoleType.Menber.ToString() }
            };
        }

        private IEnumerable<string> GetFakeLicensees()
        {
            IEnumerable<string> result = Enumerable.Empty<string>();
            var jsonContent = GetSettingFileContent();

            if (!string.IsNullOrEmpty(jsonContent))
            {
                result = JsonConvert.DeserializeObject<IEnumerable<string>>(jsonContent);
            }

            return result;
        }

        protected internal virtual string GetSettingFileContent()
        {
            const string FilePath = "~/App_Data/FakeLicensee.json";
            using (var reader = new StreamReader(HostingEnvironment.MapPath(FilePath)))
            {
                return reader.ReadToEnd();
            }
        }
    }
}