namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.LrfFunction;
    using Model.DataDomain;
    using Model.ViewModel.LrfFunction;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    public class ManageLrfFunctionController : BaseController
    {
        private readonly IManageLrfFunctionService _service;

        public ManageLrfFunctionController()
        {
            _service = new ManageLrfFunctionService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            var viewModel = new SearchLrfFunctionViewModel
            {
                GroupFunctionList = _service.GetGroupFunctionList(),
                TypeList = GetFunctionTypeList(),
                EnvironmentList = GetEnvironmentList()
            };

            return View(viewModel);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Read)]
        public JsonResult Search(LrfFunctionCriteria criteria)
        {
            return Json(_service.GetFunctionList(criteria));
        }

        private IDictionary<int, string> GetFunctionTypeList()
        {
            var result = new Dictionary<int, string>();

            foreach (LrfFunctionType type in Enum.GetValues(typeof(LrfFunctionType)))
            {
                result.Add((int)type, type.ToString());
            }

            return result;
        }

        private IEnumerable<string> GetEnvironmentList()
        {
            return new List<string> { EnvironmentType.LIVE, EnvironmentType.UAT };
        }
    }
}