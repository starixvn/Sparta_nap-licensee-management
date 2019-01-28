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
    using Model.ViewModel.ITUser;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    public class ITUserManagementController : BaseController
    {
        private readonly IITUserManagementService _service;
        private readonly IManageLrfFunctionService _functionService;

        public ITUserManagementController()
        {
            _service = new ITUserManagementService();
            _functionService = new ManageLrfFunctionService();
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
            var viewModel = new EditFunctionViewModel
            {
                UserName = userName,
                FunctionList = _functionService.GetFunctionList(),
                LicenseeList = _service.GetLicenseeUserList(userName, true)
            };

            return View(viewModel);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeUserFunction(UserLicenseeFunctionCriteria criteria)
        {
            return Json(_service.GetLicenseeUserFunction(criteria));
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult Search(SearchUserCriteria criteria)
        {
            return Json(_service.GetUserList(criteria));
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeUserList(string userName)
        {
            return Json(_service.GetLicenseeUserList(userName));
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