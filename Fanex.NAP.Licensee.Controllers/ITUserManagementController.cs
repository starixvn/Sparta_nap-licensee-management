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
        private readonly ICommonService _commonService;

        public ITUserManagementController()
        {
            _service = new ITUserManagementService();
            _functionService = new ManageLrfFunctionService();
            _commonService = new CommonService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public ActionResult Edit(string userName)
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
        public JsonResult GetLicenseeUserCurrency(UserLicenseeCurrencyCriteria criteria)
        {
            return Json(_service.GetLicenseeUserCurrency(criteria));
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

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult AssignUser(AssignUserCriteria criteria)
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

            var result = _service.AssignUser(criteria);
            var error = result.Any() ? string.Join("<br>", result.Select(x => x.Message)) : null;

            return Json(new { IsSuccess = !result.Any(x => !x.IsOk), Error = error });
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult EditFunction(EditFunctionCriteria criteria)
        {
            var errorBuilder = new StringBuilder();
 
            errorBuilder.Append(CheckEmptyParameter("User", criteria.UserName, "<br>"));

            if (!criteria.NewFunctions.Any() && !criteria.RemoveFunctions.Any())
            {
                errorBuilder.Append("Function is empty!<br>");
            }

            errorBuilder.Append(CheckInvalidRedmineId(criteria.RedmineId));

            if (errorBuilder.Length > 0)
            {
                return Json(new { IsSuccess = false, Error = errorBuilder.ToString() });
            }

            var result = _service.EditFunction(criteria);
            var error = result.Any() ? string.Join("<br>", result.Select(x => x.Message)) : null;

            return Json(new { IsSuccess = !result.Any(x => !x.IsOk), Error = error });
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult EditCurrency(EditCurrencyCriteria criteria)
        {
            var errorBuilder = new StringBuilder();

            errorBuilder.Append(CheckEmptyParameter("User", criteria.UserName, "<br>"));

            if (!criteria.ActiveCurrencies.Any() && !criteria.DeactiveCurrencies.Any())
            {
                errorBuilder.Append("Currency is empty!<br>");
            }

            errorBuilder.Append(CheckInvalidRedmineId(criteria.RedmineId));

            if (errorBuilder.Length > 0)
            {
                return Json(new { IsSuccess = false, Error = errorBuilder.ToString() });
            }

            var result = _service.EditCurrency(criteria);
            var error = result.Any() ? string.Join("<br>", result.Select(x => x.Message)) : null;

            return Json(new { IsSuccess = !result.Any(x => !x.IsOk), Error = error });
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetCurrencyList()
        {
            return Json(_commonService.GetCurrencyList);
        }
    }
}