namespace Fanex.NAP.Licensee.Controllers
{
    using System.Linq;
    using System.Text;
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

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public ActionResult EditFunction(string userName)
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

        public JsonResult AssignFunction(AssignUserCriteria criteria)
        {
            var errorBuilder = new StringBuilder();
            if (criteria.UserId <= 0)
            {
                errorBuilder.Append("User is invalid!<br>");
            }

            errorBuilder.Append(
                CheckEmptyParameter(
                    "Licensee",
                    string.IsNullOrWhiteSpace(criteria.AssignedLicensees) ? criteria.AssignedLicensees : criteria.UnassignedLicensees,
                    "<br>"));
            errorBuilder.Append(CheckInvalidRedmineId(criteria.RedmineId));

            if (errorBuilder.Length > 0)
            {
                return Json(new { IsSuccess = false, Error = errorBuilder.ToString() });
            }

            var result = _service.Assign(criteria);
            var error = result.Any() ? string.Join("<br>", result.Select(x => x.Message)) : null;

            return Json(new { IsSuccess = !result.Any(x => !x.IsOk), Error = error });
        }
    }
}