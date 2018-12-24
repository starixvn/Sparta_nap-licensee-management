namespace Fanex.NAP.Licensee.Service
{
    using System.Globalization;
    using System.Linq;
    using Core;
    using Model.Criteria.SourceLicenseeSetting;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.Enumerations;

    public class SourceLicenseeSettingService : ISourceLicenseeSettingService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public SourceLicenseeSettingService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public ResultGridData<SourceLicensee> Search(SearchSourceLicenseeCriteria criteria, string sp = "Nap_LM_SourceLicensee_Select")
        {
            var result = new ResultGridData<SourceLicensee>();

            using (var db = _objectDbGenerator.Create(sp))
            {
                result.Data = db.Query<SourceLicensee>(criteria);
            }

            result.TotalItem = criteria.TotalItem;

            return result;
        }

        public ResultGridData<SourceLicenseeSettingResult> Add(NewSourceLicenseeCriteria criteria)
        {
            var result = new ResultGridData<SourceLicenseeSettingResult>();
            var param = criteria.SpParam;

            using (var db = _objectDbGenerator.Create("Nap_LM_SourceLicensee_Insert"))
            {
                result.Data = db.Query<SourceLicenseeSettingResult>(param);
            }

            var affectedRow = param.GetType().GetProperty("AffectedRow");
            result.TotalItem = affectedRow.GetValue(param, null) ?? 0;

            if (!result.Data.Any())
            {
                WriteInsertActionLog(criteria);
            }

            return result;
        }

        public ResultGridData<SourceLicenseeSettingResult> Update(SuspendSourceLicenseeCriteria criteria)
        {
            var result = new ResultGridData<SourceLicenseeSettingResult>();
            var param = criteria.SpParam;

            using (var db = _objectDbGenerator.Create("Nap_LM_SourceLicensee_Update"))
            {
                result.Data = db.Query<SourceLicenseeSettingResult>(param);
            }

            if (!result.Data.Any())
            {
                WriteUpdateActionLog(criteria);
            }

            return result;
        }

        private void WriteInsertActionLog(NewSourceLicenseeCriteria criteria)
        {
            var doing = "<SourceLicensee"
                        + $" SiteName=\"{criteria.LicenseeName}\""
                        + $" SiteNameId=\"{criteria.LicenseeId}\""
                        + $" SourceSiteName=\"{criteria.SourceLicenseeName}\""
                        + $" SourceSiteNameId=\"{criteria.SourceLicenseeId}\""
                        + $" Currency=\"{criteria.Currency}\""
                        + $" CurrencyId=\"{criteria.CurrencyId}\""
                        + $" Role=\"{criteria.RoleId}\""
                        + $" EffectiveDate=\"{criteria.FromDate.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + $" EndDate=\"{criteria.ToDate.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + $" AddAll=\"{criteria.IsAddAll}\""
                        + ">"
                        + (criteria.IsAddAll ? string.Empty : "\"" + criteria.SourceIdList + "\"")
                        + "</SourceLicensee>";

            WriteLog(ActionLogType.SourceLicensee_Insert, "Nap_LM_SourceLicensee_Insert", doing, criteria.RedmineId);
        }

        private void WriteUpdateActionLog(SuspendSourceLicenseeCriteria criteria)
        {
            var doing = "<SourceLicensee"
                        + $" EndDate=\"{criteria.EndDate.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + $" Restart=\"{criteria.Restart}\""
                        + $" RestartFrom=\"{criteria.RestartFrom.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + $" RestartTo=\"{criteria.RestartTo.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + $" IDs=\"{criteria.SettingIdList}\""
                        + " />";

            WriteLog(ActionLogType.SourceLicensee_Update, "Nap_LM_SourceLicensee_Update", doing, criteria.RedmineId);
        }

        private void WriteLog(ActionLogType action, string sp, string setting, string redmineId)
        {
            var user = AppSession.CurrentUser;
            var doing = $"<Action value=\"{action.ToString()}\">"
                + $"<RedmineId>{redmineId}</RedmineId>"
                + $"<SpName>{sp}</SpName>"
                + $"<UpdatedBy UserId=\"{user.Id}\" UserName=\"{user.Username}\" />"
                + setting
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