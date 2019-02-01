namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Text;
    using Core;
    using Model.Criteria.LrfFunction;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.Enumerations;

    public class ManageLrfFunctionService : IManageLrfFunctionService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public ManageLrfFunctionService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public IEnumerable<OptionItem> GetGroupFunctionList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_GetTopParentFunction"))
            {
                return db.Query<OptionItem>();
            }
        }

        public ResultGridData<LrfFunctionHierarchy> GetFunctionList(int parentFunctionId)
        {
            var result = new ResultGridData<LrfFunctionHierarchy>();

            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_Select"))
            {
                var functionList = db.Query<LrfFunctionHierarchy>(new { ParentFunctionId = parentFunctionId });
                result.Data = BuildFunctionHierarchy(functionList);
                result.TotalItem = functionList.Count();
            }

            return result;
        }

        public IEnumerable<OptionItem> GetFunctionList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_SelectAll"))
            {
                return db.Query<OptionItem>();
            }
        }

        public IEnumerable<OptionItem> GetParentFunctionList(int functionId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_GetParentFunctions"))
            {
                return db.Query<OptionItem>(new { functionId = functionId });
            }
        }

        public LrfFunction GetFunction(int id)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_Get"))
            {
                return db.QueryEntity<LrfFunction>(new { functionId = id });
            }
        }

        public ResultData<LrfFunction> Insert(LrfFunctionCriteria criteria)
        {
            var result = new ResultData<LrfFunction>();
            var param = criteria.SpParam;
            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_Insert"))
            {
                result.Error = db.QueryEntity<string>(param);
            }

            int functionId = param.GetType().GetProperty("FunctionId").GetValue(param, null);
            result.Data = GetFunction(functionId);
            result.IsSuccess = result.Data != null;

            if (result.IsSuccess)
            {
                criteria.FunctionId = functionId;
                WriteInsertFunctionActionLog(criteria);
            }

            return result;
        }

        public ResultData<LrfFunction> Update(LrfFunctionCriteria criteria)
        {
            var result = new ResultData<LrfFunction>();
            var oldData = GetFunction(criteria.FunctionId);

            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_Update"))
            {
                result.Error = db.QueryEntity<string>(criteria.SpParam);
            }

            result.Data = GetFunction(criteria.FunctionId);
            result.IsSuccess = result.Error == null;

            if (result.IsSuccess)
            {
                WriteUpdateFunctionActionLog(oldData, criteria);
            }

            return result;
        }

        public IEnumerable<OptionItem> GetLicenseeFunctionList(int functionId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_GetLicensee"))
            {
                return db.Query<OptionItem>(new { FunctionId = functionId });
            }
        }

        public IEnumerable<ResultInfo> Assign(AssignLrfFunctionCriteria criteria)
        {
            IEnumerable<ResultInfo> result;

            using (var db = _objectDbGenerator.Create("Nap_LM_LrfFunction_AssignToLicensee"))
            {
                result = db.Query<ResultInfo>(criteria.SpParam);
            }

            if (!result.Any(x => !x.IsOk))
            {
                WriteAssignFunctionActionLog(criteria, result.Any() ? string.Join("\\r\\n", result.Select(x => x.Message)) : null);
            }

            return result;
        }

        private IList<LrfFunctionHierarchy> BuildFunctionHierarchy(IEnumerable<LrfFunctionHierarchy> functionList)
        {
            var hierarchy = functionList.Where(x => x.Root).ToList();
            foreach (var func in hierarchy)
            {
                func.Children = GetChildrenFunctionList(func.FunctionId, functionList);
            }

            return hierarchy;
        }

        private IList<LrfFunctionHierarchy> GetChildrenFunctionList(int parentId, IEnumerable<LrfFunctionHierarchy> functionList)
        {
            var children = functionList.Where(x => x.ParentId == parentId).ToList();

            foreach (var func in children)
            {
                func.Children = GetChildrenFunctionList(func.FunctionId, functionList);
            }

            return children;
        }

        [SuppressMessage("StyleCop.CSharp.StylecopPlus.Rules", "SP2101:MethodMustNotContainMoreLinesThan",
            Justification = "Reviewed. Suppression is OK here.")]
        private void WriteUpdateFunctionActionLog(LrfFunction oldData, LrfFunctionCriteria criteria)
        {
            var oldValue = new StringBuilder(string.Empty);
            var newValue = new StringBuilder(string.Empty);

            if (oldData.Name != criteria.Name)
            {
                oldValue.Append($" Name=\"{oldData.Name}\"");
                newValue.Append($" Name=\"{criteria.Name}\"");
            }

            if (oldData.Description != (criteria.Description ?? string.Empty))
            {
                oldValue.Append($" Description=\"{oldData.Description}\"");
                newValue.Append($" Description=\"{criteria.Description}\"");
            }

            if (oldData.ParentId != criteria.ParentId)
            {
                oldValue.Append($" ParentId=\"{oldData.ParentId}\"");
                newValue.Append($" ParentId=\"{criteria.ParentId}\"");
            }

            if (oldData.Url != (criteria.Url ?? string.Empty))
            {
                oldValue.Append($" Url=\"{oldData.Url}\"");
                newValue.Append($" Url=\"{criteria.Url}\"");
            }

            if (oldData.IsMenu != criteria.IsMenu)
            {
                oldValue.Append($" IsMenu=\"{oldData.IsMenu}\"");
                newValue.Append($" IsMenu=\"{criteria.IsMenu}\"");
            }

            if (oldData.IsActive != criteria.IsActive)
            {
                oldValue.Append($" IsActive=\"{oldData.IsActive}\"");
                newValue.Append($" IsActive=\"{criteria.IsActive}\"");
            }

            if (oldData.DisplayOrder != criteria.DisplayOrder)
            {
                oldValue.Append($" DisplayOrder=\"{oldData.DisplayOrder}\"");
                newValue.Append($" DisplayOrder=\"{criteria.DisplayOrder}\"");
            }

            if (oldData.IsNew != criteria.IsNew)
            {
                oldValue.Append($" IsNew=\"{oldData.IsNew}\"");
                newValue.Append($" IsNew=\"{criteria.IsNew}\"");
            }

            if (oldData.FunctionKey != criteria.FunctionKey)
            {
                oldValue.Append($" FunctionKey=\"{oldData.FunctionKey}\"");
                newValue.Append($" FunctionKey=\"{criteria.FunctionKey}\"");
            }

            if (oldData.Environment != criteria.Environment)
            {
                oldValue.Append($" Environment=\"{oldData.Environment}\"");
                newValue.Append($" Environment=\"{criteria.Environment}\"");
            }

            if (oldData.IsFunction != criteria.IsFunction)
            {
                oldValue.Append($" IsFunction=\"{oldData.IsFunction}\"");
                newValue.Append($" IsFunction=\"{criteria.IsFunction}\"");
            }

            var doing = $"<Function FunctionId=\"{criteria.FunctionId}\">"
                        + (newValue.Length > 0 ? "<New " + newValue.ToString() + " />" : string.Empty)
                        + (oldValue.Length > 0 ? "<Old " + oldValue.ToString() + " />" : string.Empty)
                        + "</Function>";

            WriteLog(ActionLogType.LrfFunction_Update, "Nap_LM_LrfFunction_Update", doing, criteria.RedmineId);
        }

        private void WriteInsertFunctionActionLog(LrfFunctionCriteria criteria)
        {
            var doing = $"<Function FunctionId=\"{criteria.FunctionId}\">"
                        + "<New"
                        + $" Name=\"{criteria.Name}\""
                        + $" Description=\"{criteria.Description}\""
                        + $" ParentId=\"{criteria.ParentId}\""
                        + $" Url=\"{criteria.Url}\""
                        + $" IsMenu=\"{criteria.IsMenu}\""
                        + $" IsActive=\"{criteria.IsActive}\""
                        + $" DisplayOrder=\"{criteria.DisplayOrder}\""
                        + $" IsNew=\"{criteria.IsNew}\""
                        + $" FunctionKey=\"{criteria.FunctionKey}\""
                        + $" Environment=\"{criteria.Environment}\""
                        + $" IsFunction=\"{criteria.IsFunction}\""
                        + " />"
                        + "</Function>";

            WriteLog(ActionLogType.LrfFunction_Insert, "Nap_LM_LrfFunction_Insert", doing, criteria.RedmineId);
        }

        private void WriteAssignFunctionActionLog(AssignLrfFunctionCriteria criteria, string result = null)
        {
            var doing = $"<Function FunctionId=\"{criteria.FunctionId}\">"
                        + $"<AssignedLicensees AssignOption=\"{criteria.AssignOption}\">{criteria.AssignedLicensees}</AssignedLicensees>"
                        + $"<UnassignedLicensees RemoveOption=\"{criteria.RemoveOption}\">{criteria.UnassignedLicensees}</UnassignedLicensees>"
                        + (result == null ? string.Empty : $"<Result>{result}</Result>")
                        + "</Function>";

            WriteLog(ActionLogType.LrfFunction_AssignToLicensee, "Nap_LM_LrfFunction_AssignToLicensee", doing, criteria.RedmineId);
        }

        private void WriteLog(ActionLogType action, string sp, string function, int redmineId)
        {
            var user = AppSession.CurrentUser;
            var doing = $"<Action value=\"{action.ToString()}\">"
                + $"<RedmineId>{redmineId}</RedmineId>"
                + $"<SpName>{sp}</SpName>"
                + $"<UpdatedBy UserId=\"{user.Id}\" UserName=\"{user.Username}\" />"
                + function
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