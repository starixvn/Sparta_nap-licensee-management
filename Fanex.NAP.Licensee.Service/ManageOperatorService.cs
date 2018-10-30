namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.Text;
    using Core;
    using Model.Criteria.Operator;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.Enumerations;
    using NAP.Core.Models;

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

        public IEnumerable<Operator> GetOperators(SearchOperatorCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Select"))
            {
                return db.Query<Operator>(criteria);
            }
        }

        public ResultData<Operator> UpdateOperator(int agentId, string operatorId, int userId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Update"))
            {
                var isSuccess = db.QueryEntity<int>(new { AgentId = agentId, OperatorId = operatorId }) == 1;
                var result = new ResultData<Operator>
                {
                    IsSuccess = isSuccess,
                    Data = GetOperator(agentId)
                };

                if (isSuccess)
                {
                    WriteUpdateActionLog(operatorId, result.Data, userId);
                }

                return result;
            }
        }

        public Agent GetAgent(int agentId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_GetAgentInfoByAgentId"))
            {
                return db.QueryEntity<Agent>(new { AgentId = agentId });
            }
        }

        public ResultData<Operator> AddOperator(OperatorCriteria criteria, int userId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Insert"))
            {
                var isSuccess = db.QueryEntity<int>(criteria) == 1;
                var result = new ResultData<Operator>
                {
                    IsSuccess = isSuccess,
                    Data = GetOperator(criteria.AgentId)
                };

                if (isSuccess)
                {
                    WriteInsertActionLog(result.Data, userId);
                }

                return result;
            }
        }

        public Operator GetOperator(int agentId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Get"))
            {
                return db.QueryEntity<Operator>(new { AgentId = agentId });
            }
        }

        public IEnumerable<ImportOperatorResult> ImportOperators(string operatorXml, int userId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Operator_Import"))
            {
                var result = db.Query<ImportOperatorResult>(new { OperatorXml = operatorXml });

                WriteImportActionLog(result, userId);

                return result;
            }
        }

        private void WriteInsertActionLog(Operator newOperator, int userId)
        {
            var doing = $"<Operator AgentId=\"{newOperator.AgentId}\">"
                    + $"<New SiteName=\"{newOperator.SiteName}\" CurrencyId=\"{newOperator.CurrencyId}\" OperatorId=\"{newOperator.OperatorId}\" />"
                    + "</Operator>";

            WriteLog(ActionLogType.InsertOperator, "Nap_LM_Operator_Insert", doing, userId);
        }

        private void WriteUpdateActionLog(string newOperatorId, Operator operatorInfo, int userId)
        {
            var doing = $"<Operator AgentId=\"{operatorInfo.AgentId}\">"
                + $"<New SiteName=\"{operatorInfo.SiteName}\" CurrencyId=\"{operatorInfo.CurrencyId}\" OperatorId=\"{newOperatorId}\" />"
                + $"<Old SiteName=\"{operatorInfo.SiteName}\" CurrencyId=\"{operatorInfo.CurrencyId}\" OperatorId=\"\" />"
                + "</Operator>";

            WriteLog(ActionLogType.UpdateOperator, "Nap_LM_Operator_Update", doing, userId);
        }

        private void WriteImportActionLog(IEnumerable<ImportOperatorResult> importResult, int userId)
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
                WriteLog(ActionLogType.ImportOperator, "Nap_LM_Operator_Import", doing.ToString(), userId);
            }
        }

        private void WriteLog(ActionLogType action, string sp, string operators, int userId)
        {
            var doing = $"<Action value=\"{action.ToString()}\">"
                + $"<SpName>{sp}</SpName>"
                + $"<User>{userId}</User>"
                + operators
                + "</Action>";

            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)action,
                CustId = userId,
                UserId = userId,
                Doing = doing
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }
    }
}