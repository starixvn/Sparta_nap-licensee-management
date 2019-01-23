namespace Fanex.NAP.Licensee.Controllers
{
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.ITUser;
    using Model.DataDomain;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    public class ITUserManagementController : BaseController
    {
        private readonly IITUserManagementService _service;

        public ITUserManagementController()
        {
            _service = new ITUserManagementService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult Search(SearchUserCriteria criteria)
        {
            return Json(_service.GetUserList(criteria));
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeUserList(int userId)
        {
            return Json(_service.GetLicenseeUserList(userId));
        }
    }
}