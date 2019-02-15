namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
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

        public IEnumerable<ITUserLicensee> GetLicenseeUserList(int userId, bool? isAssigned = null)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_GetLicensee"))
            {
                return db.Query<ITUserLicensee>(new { UserId = userId, IsAssigned = isAssigned });
            }
        }

        public IEnumerable<ResultInfo> AddUser(AddUserCriteria criteria)
        {
            IEnumerable<ResultInfo> result;

            var param = criteria.SpParam;
            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_Insert"))
            {
                result = db.Query<ResultInfo>(param);
            }

            int userId = param.GetType().GetProperty("UserId").GetValue(param, null);
            if (userId > 0)
            {
                WriteAddUserActionLog(criteria, result.Any() ? string.Join("\\r\\n", result.Select(x => x.Message)) : null);
            }

            return result;
        }

        public IEnumerable<ResultInfo> AssignUser(AssignUserCriteria criteria)
        {
            IEnumerable<ResultInfo> result;

            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_AssignToLicensee"))
            {
                result = db.Query<ResultInfo>(criteria.SpParam);
            }

            if (!result.Any(x => !x.IsOk))
            {
                WriteAssignUserActionLog(criteria, result.Any() ? string.Join("\\r\\n", result.Select(x => x.Message)) : null);
            }

            return result;
        }

        public IEnumerable<ResultInfo> EditFunction(EditFunctionCriteria criteria)
        {
            IEnumerable<ResultInfo> result;

            var param = new
            {
                UserId = criteria.UserId,
                NewFunctions = BuildFunctionXMLParameter(criteria.NewFunctions),
                RemovedFunctions = BuildFunctionXMLParameter(criteria.RemovedFunctions)
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_UpdateFunction"))
            {
                result = db.Query<ResultInfo>(param);
            }

            if (!result.Any(x => !x.IsOk))
            {
                WriteEditFunctionActionLog(criteria, param.NewFunctions, param.RemovedFunctions, result.Any() ? string.Join("\\r\\n", result.Select(x => x.Message)) : null);
            }

            return result;
        }

        public IEnumerable<ResultInfo> EditCurrency(EditCurrencyCriteria criteria)
        {
            IEnumerable<ResultInfo> result;

            var param = new
            {
                UserId = criteria.UserId,
                ActiveCurrencies = BuildCurrencyXMLParameter(criteria.ActiveCurrencies),
                DeactiveCurrencies = BuildCurrencyXMLParameter(criteria.DeactiveCurrencies)
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_UpdateCurrency"))
            {
                result = db.Query<ResultInfo>(param);
            }

            if (!result.Any(x => !x.IsOk))
            {
                WriteEditCurrencyActionLog(
                    criteria,
                    param.ActiveCurrencies,
                    param.DeactiveCurrencies,
                    result.Any() ? string.Join("\\r\\n", result.Select(x => x.Message)) : null);
            }

            return result;
        }

        public IEnumerable<ITUserLicenseeFunction> GetLicenseeUserFunction(UserLicenseeFunctionCriteria criteria)
        {
            IEnumerable<ITUserLicensee> licensees;
            IEnumerable<ITUserFunctionHierarchy> functions;
            var result = new List<ITUserLicenseeFunction>();

            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_GetLicenseeFunction"))
            {
                using (var multi = db.QueryMultiple(criteria))
                {
                    licensees = multi.Read<ITUserLicensee>();
                    functions = multi.Read<ITUserFunctionHierarchy>();
                }
            }

            foreach (var licensee in licensees)
            {
                var hierarchy = BuildFunctionHierarchy(functions.Where(x => x.LicenseeId == licensee.Id));

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

        public IEnumerable<ITUserLicenseeCurrency> GetLicenseeUserCurrency(UserLicenseeCurrencyCriteria criteria)
        {
            IEnumerable<ITUserLicensee> licensees;
            IEnumerable<ITUserCurrency> currencies;
            var result = new List<ITUserLicenseeCurrency>();

            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_GetLicenseeCurrency"))
            {
                using (var multi = db.QueryMultiple(criteria))
                {
                    licensees = multi.Read<ITUserLicensee>();
                    currencies = multi.Read<ITUserCurrency>();
                }
            }

            foreach (var licensee in licensees)
            {
                var currencieList = currencies.Where(x => x.LicenseeId == licensee.Id).ToList();

                if (currencieList.Any())
                {
                    result.Add(new ITUserLicenseeCurrency
                    {
                        Licensee = licensee,
                        Currencies = currencieList
                    });
                }
            }

            return result;
        }

        public ITUser Get(int userId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_Get"))
            {
                return db.QueryEntity<ITUser>(new { UserId = userId });
            }
        }

        private string BuildFunctionXMLParameter(IEnumerable<LicenseeFunctionCriteria> criteria)
        {
            if (criteria == null || !criteria.Any())
            {
                return string.Empty;
            }

            var builder = new StringBuilder();
            builder.Append("<ROOT>");

            foreach (var item in criteria)
            {
                builder.Append($"<LicenseeFunction LicenseeName=\"{item.LicenseeName}\" FunctionId=\"{item.FunctionId}\"/>");
            }

            builder.Append("</ROOT>");

            return builder.ToString();
        }

        private string BuildCurrencyXMLParameter(IEnumerable<LicenseeCurrencyCriteria> criteria)
        {
            if (criteria == null || !criteria.Any())
            {
                return string.Empty;
            }

            var builder = new StringBuilder();
            builder.Append("<ROOT>");

            foreach (var item in criteria)
            {
                builder.Append($"<LicenseeCurrency LicenseeName=\"{item.LicenseeName}\" CurrencyId=\"{item.CurrencyId}\"/>");
            }

            builder.Append("</ROOT>");

            return builder.ToString();
        }

        private IEnumerable<ITUserFunctionHierarchy> BuildFunctionHierarchy(IEnumerable<ITUserFunctionHierarchy> functionList)
        {
            var hierarchy = functionList
                .GroupJoin(
                    functionList,
                    func => func.ParentId,
                    parent => parent.FunctionId,
                    (func, parent) => new { Function = func, Parents = parent })
                .Where(x => !x.Parents.Any())
                .Select(y => y.Function)
                .ToList();

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

        private void WriteAddUserActionLog(AddUserCriteria criteria, string result = null)
        {
            var doing = $"<User UserName=\"{criteria.UserName}\""
                        + $" FirstName=\"{criteria.FirstName}\""
                        + $" LastName=\"{criteria.LastName}\""
                        + $" Email=\"{criteria.Email}\""
                        + $" IsAdmin=\"{criteria.IsAdmin}\""
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" IsOpen=\"{criteria.IsOpen}\""
                        + $" UserSalt=\"{criteria.Token}\""
                        + $" UserPwd=\"{criteria.Password}\""
                        + " SystemId=\"1\""
                        + $" Option=\"{criteria.Option}\""
                        + ">"
                        + (result == null ? string.Empty : $"<Result>{result}</Result>")
                        + "</User>";

            WriteLog(ActionLogType.ITUser_Insert, "Nap_LM_ITUser_Insert", doing, criteria.RedmineId);
        }

        private void WriteAssignUserActionLog(AssignUserCriteria criteria, string result = null)
        {
            var doing = $"<User UserId=\"{criteria.UserId}\">"
                        + $"<AssignedLicensees AssignOption=\"{criteria.AssignOption}\">{criteria.AssignedLicensees}</AssignedLicensees>"
                        + $"<UnassignedLicensees RemoveOption=\"{criteria.RemoveOption}\">{criteria.UnassignedLicensees}</UnassignedLicensees>"
                        + (result == null ? string.Empty : $"<Result>{result}</Result>")
                        + "</User>";

            WriteLog(ActionLogType.ITUser_AssignToLicensee, "Nap_LM_ITUser_AssignToLicensee", doing, criteria.RedmineId);
        }

        private void WriteEditFunctionActionLog(EditFunctionCriteria criteria, string newFunctions, string removedFunctions, string result = null)
        {
            var doing = $"<User UserId=\"{criteria.UserId}\">"
                        + $"<NewFunctions>{newFunctions}</NewFunctions>"
                        + $"<RemoveFunctions>{removedFunctions}</RemoveFunctions>"
                        + (result == null ? string.Empty : $"<Result>{result}</Result>")
                        + "</User>";

            WriteLog(ActionLogType.ITUser_UpdateLRFFunction, "Nap_LM_ITUser_UpdateFunction", doing, criteria.RedmineId);
        }

        private void WriteEditCurrencyActionLog(EditCurrencyCriteria criteria, string activeCurrencies, string deactiveCurrencies, string result = null)
        {
            var doing = $"<User UserId=\"{criteria.UserId}\">"
                        + $"<ActiveCurrencies>{activeCurrencies}</ActiveCurrencies>"
                        + $"<DeactiveCurrencies>{deactiveCurrencies}</DeactiveCurrencies>"
                        + (result == null ? string.Empty : $"<Result>{result}</Result>")
                        + "</User>";

            WriteLog(ActionLogType.ITUser_UpdateCurrency, "Nap_LM_ITUser_UpdateCurrency", doing, criteria.RedmineId);
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