namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Text;
    using Core;
    using Model.Criteria.Operator;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.Enumerations;

    public class ManageOperatorService : IManageOperatorService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public ManageOperatorService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public IEnumerable<string> GetSiteNames()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_SubsidiarySiteName_Select"))
            {
                return db.Query<string>();
            }
        }

        public ResultGridData<Operator> GetOperators(SearchOperatorCriteria criteria)
        {
            var result = new ResultGridData<Operator>();

            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Search"))
            {
                result.Data =  db.Query<Operator>(criteria);
            }

            result.TotalItem = criteria.TotalItem;

            return result;
        }

        public ResultData<Operator> UpdateOperator(int agentId, string operatorId)
        {
            var result = new ResultData<Operator>();

            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Update"))
            {
                result.IsSuccess = db.QueryEntity<int>(new { AgentId = agentId, OperatorId = operatorId }) == 1;
                result.Data = GetOperator(agentId);
            }

            if (result.IsSuccess)
            {
                WriteUpdateActionLog(operatorId, result.Data);
            }

            return result;
        }

        public Agent GetAgent(int agentId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_GetAgentInfoByAgentId"))
            {
                return db.QueryEntity<Agent>(new { AgentId = agentId });
            }
        }

        public ResultData<Operator> AddOperator(OperatorCriteria criteria)
        {
            var result = new ResultData<Operator>();

            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Insert"))
            {
                result.IsSuccess = db.QueryEntity<int>(criteria) == 1;
                result.Data = GetOperator(criteria.AgentId);
            }

            if (result.IsSuccess)
            {
                WriteInsertActionLog(result.Data);
            }

            return result;
        }

        public Operator GetOperator(int agentId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Get"))
            {
                return db.QueryEntity<Operator>(new { AgentId = agentId });
            }
        }

        public IEnumerable<ImportOperatorResult> ImportOperators(string operatorXml)
        {
            IEnumerable<ImportOperatorResult> result;

            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Import"))
            {
                result = db.Query<ImportOperatorResult>(new { OperatorXml = operatorXml });
            }

            WriteImportActionLog(result);

            return result;
        }

        public bool DeleteOperator(int agentId)
        {
            var result = false;

            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Delete"))
            {
                result = db.QueryEntity<int>(new { AgentId = agentId }) == 1;
            }

            if (result)
            {
                WriteDeleteActionLog(agentId);
            }

            return result;
        }

        private void WriteInsertActionLog(Operator newOperator)
        {
            var doing = $"<Operator AgentId=\"{newOperator.AgentId}\">"
                    + $"<New SiteName=\"{newOperator.SiteName}\" CurrencyId=\"{newOperator.CurrencyId}\" OperatorId=\"{newOperator.OperatorId}\" />"
                    + "</Operator>";

            WriteLog(ActionLogType.InsertOperator, "Nap_LM_Operator_Insert", doing);
        }

        private void WriteUpdateActionLog(string newOperatorId, Operator operatorInfo)
        {
            var doing = $"<Operator AgentId=\"{operatorInfo.AgentId}\">"
                + $"<New SiteName=\"{operatorInfo.SiteName}\" CurrencyId=\"{operatorInfo.CurrencyId}\" OperatorId=\"{newOperatorId}\" />"
                + $"<Old SiteName=\"{operatorInfo.SiteName}\" CurrencyId=\"{operatorInfo.CurrencyId}\" OperatorId=\"\" />"
                + "</Operator>";

            WriteLog(ActionLogType.UpdateOperator, "Nap_LM_Operator_Update", doing);
        }

        private void WriteDeleteActionLog(int agentId)
        {
            var doing = $"<Operator AgentId=\"{agentId}\"></Operator>";

            WriteLog(ActionLogType.DeleteOperator, "Nap_LM_Operator_Delete", doing);
        }

        private void WriteImportActionLog(IEnumerable<ImportOperatorResult> importResult)
        {
            var doing = new StringBuilder();

            foreach (var result in importResult)
            {
                if (result.Status != "Error")
                {
                    doing.Append($"<Operator AgentId=\"{result.AgentId}\">");
                    doing.Append($"<New SiteName=\"{result.SiteName}\" CurrencyId=\"{result.CurrencyId}\" OperatorId=\"{result.OperatorId}\" />");
                    if (result.Status == "Update")
                    {
                        doing.Append($"<Old SiteName=\"{result.SiteName}\" CurrencyId=\"{result.CurrencyId}\" OperatorId=\"\" />");
                    }

                    doing.Append("</Operator>");
                }
            }

            if (doing.Length > 0)
            {
                WriteLog(ActionLogType.ImportOperator, "Nap_LM_Operator_Import", doing.ToString());
            }
        }

        private void WriteLog(ActionLogType action, string sp, string operators)
        {
            var user = AppSession.CurrentUser;
            var doing = $"<Action value=\"{action.ToString()}\">"
                + $"<SpName>{sp}</SpName>"
                + $"<UpdatedBy UserId=\"{user.Id}\" UserName=\"{user.Username}\" />"
                + operators
                + "</Action>";

            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)action,
                CustId = user.Id,
                UserId = user.Id,
                Doing = doing
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }
    }
}