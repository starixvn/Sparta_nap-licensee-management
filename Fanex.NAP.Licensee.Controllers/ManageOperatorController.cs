namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    using Attributes;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.Operator;
    using Model.DataDomain;
    using Model.DTO;
    using Model.ViewModel.ManageOperator;
    using ONEbook.UM.Filters;
    using Service;

    [NapSuperAuth]
    [CheckUMFilter]
    [CustomHandleError]
    [CustomValidateAntiForgery]
    public class ManageOperatorController : BaseController
    {
        private const string ImportTemplatePath = @"~/App_Data/Template/OperatorImportTemplate.csv";
        private readonly IManageOperatorService _operatorService;
        private readonly ICommonService _commonService;

        public ManageOperatorController()
        {
            _operatorService = new ManageOperatorService();
            _commonService = new CommonService();
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Read)]
        public ActionResult Index()
        {
            return View(GetSearchViewModel());
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Host)]
        public ActionResult Get(int agentId = 0)
        {
            var viewModel = agentId == 0
                ? new OperatorViewModel
                {
                    Operator = new Operator(),
                    SiteNameList = _operatorService.GetSiteNames()
                }
                : new OperatorViewModel
                {
                    Operator = _operatorService.GetOperator(agentId),
                    SiteNameList = Enumerable.Empty<string>()
                };

            return View(viewModel);
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Host)]
        public ActionResult Import()
        {
            return View();
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Read)]
        public JsonResult Search(SearchOperatorCriteria criteria)
        {
            var result = _operatorService.GetOperators(criteria);
            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Host)]
        public JsonResult Add(OperatorCriteria criteria)
        {
            var result = _operatorService.AddOperator(criteria);

            result.Error = result.IsSuccess ? null : "Operator has been added by someone!";

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Host)]
        public JsonResult Update(OperatorCriteria criteria)
        {
            var result = _operatorService.UpdateOperator(criteria.AgentId, criteria.OperatorId);

            result.Error = result.IsSuccess ? null : "OperatorId has been updated by someone!";

            return Json(result);
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Read)]
        public ActionResult Validate(string agentId)
        {
            int value = 0;
            int.TryParse(agentId, out value);

            if (value <= 0)
            {
                return Json(new { IsValid = false, Error = "Invalid input!" });
            }

            var opt = _operatorService.GetOperator(value);
            if (opt != null)
            {
                return Json(new { IsValid = false, Error = "Operator setting of this agent already exists!" });
            }

            var agent = _operatorService.GetAgent(value);
            if (agent == null)
            {
                return Json(new { IsValid = false, Error = "Agent does not exist!" });
            }

            return Json(new { IsValid = true, Agent = agent });
        }

        [HttpGet]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Host)]
        public ActionResult DownLoadImportTemplate()
        {
            return File(ImportTemplatePath, System.Net.Mime.MediaTypeNames.Application.Octet, Path.GetFileName(ImportTemplatePath));
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Host)]
        public JsonResult ImportFile()
        {
            var content = Request.Files["file"].InputStream;

            using (var stream = new StreamReader(content))
            {
                var operators = new List<Operator>();
                var errors = new List<string>();
                var line = 2;

                stream.ReadLine(); // ignore first line
                while (!stream.EndOfStream)
                {
                    var data = stream.ReadLine().Split(',');
                    var opt = new Operator
                    {
                        AgentId = ConvertInt(data[0]),
                        UserName = data[1],
                        SiteName = data[2],
                        OperatorId = data[3]
                    };

                    if (!opt.IsValid)
                    {
                        errors.Add($"Invalid data in line {line}!");
                    }
                    else
                    {
                        operators.Add(opt);
                    }

                    line++;
                }

                if (errors.Any())
                {
                    return Json(new { IsSuccess = false, Error = errors });
                }
                else if (!operators.Any())
                {
                    errors.Add("Imported file is empty!");
                    return Json(new { IsSuccess = false, Error = errors });
                }
                else
                {
                    var result = _operatorService.ImportOperators(BuildOperatorXml(operators));
                    return Json(new { IsSuccess = true, Data = result });
                }
            }
        }

        [HttpPost]
        [AjaxRequest]
        [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Host)]
        public JsonResult Delete(int agentId)
        {
            var result = _operatorService.DeleteOperator(agentId);

            return Json(new { IsSuccess = result, Error = result ? null : "Operator has been deleted by someone!" });
        }

        private string BuildOperatorXml(List<Operator> operators)
        {
            var builder = new StringBuilder("<ROOT>");
            var id = 1;

            foreach (var opt in operators)
            {
                builder.Append($"<Operator ID=\"{id}\" AgentId=\"{opt.AgentId}\" UserName=\"{opt.UserName}\" SiteName=\"{opt.SiteName}\" OperatorId=\"{opt.OperatorId}\" />");
                id++;
            }

            builder.Append("</ROOT>");
            return builder.ToString();
        }

        private int ConvertInt(string text)
        {
            int value = 0;
            int.TryParse(text, out value);

            return value;
        }

        private SearchOperatorViewModel GetSearchViewModel()
        {
            return new SearchOperatorViewModel
            {
                SiteNameList = _operatorService.GetSiteNames(),
                CurrencyList = _commonService.GetCurrencyList
            };
        }
    }
}