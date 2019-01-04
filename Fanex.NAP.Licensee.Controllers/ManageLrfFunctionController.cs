namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.DataDomain;
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
            return View();
        }
    }
}