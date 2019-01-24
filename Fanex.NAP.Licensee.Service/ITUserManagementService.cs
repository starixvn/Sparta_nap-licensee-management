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

        public IEnumerable<OptionItem> GetLicenseeUserList(int userId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_GetLicensee"))
            {
                return db.Query<OptionItem>(new { UserId = userId });
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