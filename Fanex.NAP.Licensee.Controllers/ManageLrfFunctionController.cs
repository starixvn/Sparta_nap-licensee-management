namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
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
            var func = _service.GetFunction(id) ?? new LrfFunction();
            var viewModel = new LrfFunctionViewModel
            {
                Function = func,
                ParentFunctionList = GetParentFunctionList(func)
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
            if (string.IsNullOrWhiteSpace(criteria.Name))
            {
                return "Function Name is empty!";
            }

            if (string.IsNullOrWhiteSpace(criteria.FunctionKey))
            {
                return "Function Key is empty!";
            }

            if (criteria.RedmineId <= 0)
            {
                return "Redmine Id is invalid!";
            }

            return null;
        }
    }
}