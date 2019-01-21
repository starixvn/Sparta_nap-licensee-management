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
                GroupFunctionList = _service.GetGroupFunctionList()
            };

            return View(viewModel);
        }

        [HttpPost]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Read)]
        public JsonResult Search(int parentFunctionId)
        {
            return Json(_service.GetFunctionList(parentFunctionId));
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageLRFFunction, Policy = Constant.Policy.Host)]
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

        public JsonResult GetLicenseeFunctionList(int functionId)
        {
            return Json(_service.GetLicenseeFunctionList(functionId));
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

            if (string.IsNullOrWhiteSpace(criteria.Name))
            {
                error.Append("Function Name is empty!<br>");
            }

            if (string.IsNullOrWhiteSpace(criteria.FunctionKey))
            {
                error.Append("Function Key is empty!<br>");
            }

            if (criteria.RedmineId <= 0)
            {
                error.Append("Redmine Id is invalid!<br>");
            }

            return error.Length > 0 ? error.ToString() : null;
        }
    }
}