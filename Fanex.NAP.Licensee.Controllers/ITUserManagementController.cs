namespace Fanex.NAP.Licensee.Controllers
{
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    using Attributes;
    using Common;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.ITUser;
    using Model.DataDomain;
    using Model.ViewModel.ITUser;
    using ONEbook.UM.AspNetMVC.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    [CustomValidateAntiForgery]
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
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public ActionResult Add()
        {
            var viewModel = new AddUserViewModel
            {
                Token = Cryptography.CreateSalt(),
                LicenseeList = _service.GetLicenseeUserList(0)
            };

            return View(viewModel);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public ActionResult Edit(int userId)
        {
            return View(_service.Get(userId));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeUserFunction(UserLicenseeFunctionCriteria criteria)
        {
            return Json(_service.GetLicenseeUserFunction(criteria));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeUserCurrency(UserLicenseeCurrencyCriteria criteria)
        {
            return Json(_service.GetLicenseeUserCurrency(criteria));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult Search(SearchUserCriteria criteria)
        {
            return Json(_service.GetUserList(criteria));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeUserList(int userId)
        {
            return Json(_service.GetLicenseeUserList(userId));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult AddUser(AddUserCriteria criteria)
        {
            if (string.IsNullOrWhiteSpace(criteria.Token))
            {
                return Json(new { IsSuccess = false, Error = "Invalid password token. Please refresh and try again!" });
            }

            var errorBuilder = new StringBuilder();
            errorBuilder.Append(CheckEmptyParameter("User Name", criteria.UserName, "<br>"));
            errorBuilder.Append(CheckEmptyParameter("Password", criteria.Password, "<br>"));
            errorBuilder.Append(CheckInvalidRedmineId(criteria.RedmineId));

            if (errorBuilder.Length > 0)
            {
                return Json(new { IsSuccess = false, Error = errorBuilder.ToString() });
            }

            var result = _service.AddUser(criteria);
            var error = result.Any() ? string.Join("<br>", result.Select(x => x.Message)) : null;

            return Json(new { IsSuccess = !result.Any(x => !x.IsOk), Error = error, Data = criteria.UserId });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult AssignUser(AssignUserCriteria criteria)
        {
            if (criteria.UserId <= 0)
            {
                return Json(new { IsSuccess = false, Error = "User is invalid!" });
            }

            var errorBuilder = new StringBuilder();
            errorBuilder.Append(
                CheckEmptyParameter(
                    "Licensee",
                    string.IsNullOrWhiteSpace(criteria.AssignedLicensees) ? criteria.UnassignedLicensees : criteria.AssignedLicensees,
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
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult EditFunction(EditFunctionCriteria criteria)
        {
            if (criteria.UserId <= 0)
            {
                return Json(new { IsSuccess = false, Error = "User is invalid!" });
            }

            var errorBuilder = new StringBuilder();
            if (criteria.NewFunctions == null && criteria.RemovedFunctions == null)
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
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult EditCurrency(EditCurrencyCriteria criteria)
        {
            if (criteria.UserId <= 0)
            {
                return Json(new { IsSuccess = false, Error = "User is invalid!" });
            }

            var errorBuilder = new StringBuilder();
            if (criteria.ActiveCurrencies == null && criteria.DeactiveCurrencies == null)
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
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetCurrencyList()
        {
            return Json(_commonService.GetCurrencyList);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetFunctionList()
        {
            return Json(_functionService.GetFunctionList());
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Read)]
        public JsonResult GetAssignedLicenseeUserList(int userId)
        {
            return Json(_service.GetLicenseeUserList(userId, true));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult EditUser(EditUserCriteria criteria)
        {
            if (criteria.UserId <= 0)
            {
                return Json(new { IsSuccess = false, Error = "User is invalid!" });
            }

            if (criteria.RedmineId <= 0)
            {
                return Json(new { IsSuccess = false, Error = "Redmine Id is invalid!" });
            }

            var result = _service.EditUser(criteria);
            var isFailed = result.Any(x => !x.IsOk);

            if (isFailed)
            {
                return Json(new { IsSuccess = false, Error = string.Join("<br>", result.Select(x => x.Message)) });
            }

            return Json(new { IsSuccess = true, Data = _service.Get(criteria.UserId) });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public JsonResult ResetPassword(ResetUserPasswordCriteria criteria)
        {
            if (criteria.UserId <= 0)
            {
                return Json(new { IsSuccess = false, Error = "User is invalid!" });
            }

            if (string.IsNullOrWhiteSpace(criteria.Token) || string.IsNullOrWhiteSpace(criteria.Password))
            {
                return Json(new { IsSuccess = false, Error = "Invalid password!" });
            }

            if (criteria.RedmineId <= 0)
            {
                return Json(new { IsSuccess = false, Error = "Redmine Id is invalid!" });
            }

            var result = _service.ResetPassword(criteria);
            var isFailed = result.Any(x => !x.IsOk);

            if (isFailed)
            {
                return Json(new { IsSuccess = false, Error = string.Join("<br>", result.Select(x => x.Message)) });
            }

            return Json(new { IsSuccess = true });
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ITUsersManagement, Policy = Constant.Policy.Host)]
        public string GetToken()
        {
            return Cryptography.CreateSalt();
        }
    }
}