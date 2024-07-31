namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.LrfFunction;
    using Model.DataDomain;
    using Model.DTO;
    using Model.ViewModel.LrfFunction;
    using ONEbook.UM.AspNetMVC.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    [CustomValidateAntiForgery]
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
                GroupFunctionList = _service.GetGroupFunctionList()
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Read)]
        public JsonResult Search(int parentFunctionId)
        {
            return Json(_service.GetFunctionList(parentFunctionId));
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Read)]
        public ActionResult Get(int id = 0)
        {
            var func = id == 0 ? new LrfFunction() : _service.GetFunction(id);
            var viewModel = new LrfFunctionViewModel
            {
                Function = func,
                ParentFunctionList = func == null ? new List<OptionItem>() : GetParentFunctionList(func)
            };

            return View(viewModel);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Host)]
        public JsonResult Add(LrfFunctionCriteria criteria)
        {
            var error = ValidateFunction(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            var result = _service.Insert(criteria);
            result.Error = result.IsSuccess
                ? null
                : (string.IsNullOrEmpty(result.Error) ? "Can not create this function. Please try later!" : result.Error);

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Host)]
        public JsonResult Edit(LrfFunctionCriteria criteria)
        {
            var error = ValidateFunction(criteria);
            if (error != null)
            {
                return Json(new { IsSuccess = false, Error = error });
            }

            var data = _service.Update(criteria);

            return Json(data);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Read)]
        public JsonResult GetLicenseeFunctionList(int functionId)
        {
            return Json(_service.GetLicenseeFunctionList(functionId));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Host)]
        public JsonResult AssignFunction(AssignLrfFunctionCriteria criteria)
        {
            var errorBuilder = new StringBuilder();
            if (criteria.FunctionId <= 0)
            {
                errorBuilder.Append("Function is invalid!<br>");
            }

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

            var result = _service.Assign(criteria);
            var error = result.Any() ? string.Join("<br>", result.Select(x => x.Message)) : null;

            return Json(new { IsSuccess = !result.Any(x => !x.IsOk), Error = error });
        }

        private IList<OptionItem> GetParentFunctionList(LrfFunction function)
        {
            var result = new List<OptionItem>();

            var validParent = _service.GetParentFunctionList(function.FunctionId);

            if (!validParent.Any(x => x.Id == function.ParentId))
            {
                result.Add(new OptionItem { Id = function.ParentId, Name = $"Unknown(Id = {function.ParentId})" });
            }

            result.AddRange(validParent);

            return result;
        }

        private string ValidateFunction(LrfFunctionCriteria criteria)
        {
            var error = new StringBuilder();

            error.Append(CheckEmptyParameter("Function Name", criteria.Name, "<br>"));
            error.Append(CheckEmptyParameter("Function Key", criteria.FunctionKey, "<br>"));
            error.Append(CheckInvalidRedmineId(criteria.RedmineId));

            return error.Length > 0 ? error.ToString() : null;
        }
    }
}