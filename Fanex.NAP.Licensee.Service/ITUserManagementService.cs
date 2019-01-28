namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Core;
    using Model.Criteria.ITUser;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.Enumerations;

    public class ITUserManagementService : IITUserManagementService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public ITUserManagementService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public ResultGridData<ITUser> GetUserList(SearchUserCriteria criteria)
        {
            var result = new ResultGridData<ITUser>();

            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_Select"))
            {
                result.Data = db.Query<ITUser>(criteria);
            }

            result.TotalItem = criteria.TotalItem;

            return result;
        }

        public IEnumerable<OptionItem> GetLicenseeUserList(string userName, bool? isAssigned = null)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_GetLicensee"))
            {
                return db.Query<OptionItem>(new { UserName = userName, IsAssigned = isAssigned });
            }
        }

        public IEnumerable<ResultInfo> Assign(AssignUserCriteria criteria)
        {
            IEnumerable<ResultInfo> result;

            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_AssignToLicensee"))
            {
                result = db.Query<ResultInfo>(criteria.SpParam);
            }

            if (!result.Any(x => !x.IsOk))
            {
                WriteAssignUseActionLog(criteria, result.Any() ? string.Join("\r\n", result.Select(x => x.Message)) : null);
            }

            return result;
        }

        public IEnumerable<ITUserLicenseeFunction> GetLicenseeUserFunction(UserLicenseeFunctionCriteria criteria)
        {
            IEnumerable<OptionItem> licensees;
            IEnumerable<ITUserFunctionHierarchy> functions;
            var result = new List<ITUserLicenseeFunction>();

            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_GetLicenseeFunction"))
            {
                using (var multi = db.QueryMultiple(criteria))
                {
                    licensees = multi.Read<OptionItem>();
                    functions = multi.Read<ITUserFunctionHierarchy>();
                }
            }

            foreach (var licensee in licensees)
            {
                var hierarchy = BuildFunctionHierarchy(licensee.Id, functions);

                if (hierarchy.Any())
                {
                    result.Add(new ITUserLicenseeFunction
                    {
                        Licensee = licensee,
                        Functions = hierarchy
                    });
                }
            }

            return result;
        }

        private IEnumerable<ITUserFunctionHierarchy> BuildFunctionHierarchy(int licenseeId, IEnumerable<ITUserFunctionHierarchy> functionList)
        {
            var hierarchy = functionList.Where(x => x.ParentId == null && x.LicenseeId == licenseeId).ToList();
            foreach (var func in hierarchy)
            {
                func.Children = GetChildrenFunctionList(func.FunctionId, functionList);
            }

            return hierarchy;
        }

        private IEnumerable<ITUserFunctionHierarchy> GetChildrenFunctionList(int parentId, IEnumerable<ITUserFunctionHierarchy> functionList)
        {
            var children = functionList.Where(x => x.ParentId == parentId).ToList();

            foreach (var func in children)
            {
                func.Children = GetChildrenFunctionList(func.FunctionId, functionList);
            }

            return children;
        }

        private void WriteAssignUseActionLog(AssignUserCriteria criteria, string result = null)
        {
            var doing = $"<User UserId=\"{criteria.UserId}\">"
                        + $"<AssignedLicensees AssignOption=\"{criteria.AssignOption}\">{criteria.AssignedLicensees}</AssignedLicensees>"
                        + $"<UnassignedLicensees RemoveOption=\"{criteria.RemoveOption}\">{criteria.UnassignedLicensees}</UnassignedLicensees>"
                        + result == null ? string.Empty : $"<Result>{result}</Result>"
                        + "</User>";

            WriteLog(ActionLogType.ITUser_AssignToLicensee, "Nap_LM_ITUser_AssignToLicensee", doing, criteria.RedmineId);
        }

        private void WriteLog(ActionLogType action, string sp, string user, int redmineId)
        {
            var logInUser = AppSession.CurrentUser;
            var doing = $"<Action value=\"{action.ToString()}\">"
                + $"<RedmineId>{redmineId}</RedmineId>"
                + $"<SpName>{sp}</SpName>"
                + $"<UpdatedBy UserId=\"{logInUser.Id}\" UserName=\"{logInUser.Username}\" />"
                + user
                + "</Action>";

            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)action,
                CustId = logInUser.Id,
                UserId = logInUser.Id,
                Doing = doing
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }
    }
}