namespace Fanex.NAP.Licensee.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    using Core.Business;
    using Core.Web.Attribute;
    using Model.Criteria.Operator;
    using Model.DataDomain;
    using Model.DTO;
    using Model.ViewModel.ManageOperator;
    using Service;

    [NapAuth(FunctionKey = NapLicenseeFunctionKeys.ManageOperator, Policy = Constant.Policy.Read)]
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
        public ActionResult Index()
        {
            return View(GetSearchViewModel());
        }

        [HttpGet]
        public ActionResult Get(int agentId = 0)
        {
            var viewModel = agentId == 0 ? new Operator() : _operatorService.GetOperator(agentId);

            return View(viewModel);
        }

        [HttpGet]
        public ActionResult Import()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Search(SearchOperatorCriteria criteria)
        {
            var result = _operatorService.GetOperators(criteria);
            return Json(result);
        }

        [HttpPost]
        public JsonResult Add(OperatorCriteria criteria)
        {
            var result = _operatorService.AddOperator(criteria);
            return Json(result);
        }

        [HttpPost]
        public JsonResult Update(OperatorCriteria criteria)
        {
            var result = _operatorService.UpdateOperator(criteria.AgentId, criteria.OperatorId);
            return Json(result);
        }

        [HttpPost]
        public ActionResult Validate(int agentId)
        {
            var opt = _operatorService.GetOperator(agentId);
            if (opt != null)
            {
                return Json(new { IsValid = false, Error = "Operator exists" });
            }

            var agent = _operatorService.GetAgent(agentId);
            if (agent == null)
            {
                return Json(new { IsValid = false, Error = "Agent does not exist" });
            }

            return Json(new { IsValid = true, Agent = agent });
        }

        [HttpGet]
        public ActionResult DownLoadImportTemplate()
        {
            return File(ImportTemplatePath, System.Net.Mime.MediaTypeNames.Application.Octet, Path.GetFileName(ImportTemplatePath));
        }

        [HttpPost]
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
                        errors.Add($"Invalid data in line {line}");
                    }
                    else
                    {
                        operators.Add(opt);
                    }

                    line++;
                }

                if (errors.Any())
                {
                    return Json(new { IsSuccess = false, Errors = errors });
                }
                else if (!operators.Any())
                {
                    errors.Add("Imported file is empty");
                    return Json(new { IsSuccess = false, Errors = errors });
                }
                else
                {
                    var result = _operatorService.ImportOperators(BuildOperatorXml(operators));
                    return Json(new { IsSuccess = true, Result = result });
                }
            }
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