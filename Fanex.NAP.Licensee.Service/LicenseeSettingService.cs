namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using Core;
    using Model.Criteria.LicenseeSetting;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.Enumerations;

    public class LicenseeSettingService : ILicenseeSettingService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public LicenseeSettingService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public ResultGridData<Licensee> Search(LicenseeCriteria criteria)
        {
            var result = new ResultGridData<Licensee>();

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Select"))
            {
                result.Data = db.Query<Licensee>(criteria);
            }

            result.TotalItem = criteria.TotalItem;

            return result;
        }

        public IEnumerable<LicenseeItem> GetLicenseeList(bool isAll = false)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicenseeList_Select"))
            {
                return db.Query<LicenseeItem>(new { IsAll = isAll });
            }
        }

        public IEnumerable<Product> GetProductList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Product_Select"))
            {
                return db.Query<Product>();
            }
        }

        public IEnumerable<SystemItem> GetSystemList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_System_Select"))
            {
                return db.Query<SystemItem>();
            }
        }

        public ResultData<Licensee> SetUpNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            var result = new ResultData<Licensee>();
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Insert"))
            {
                result.Error = db.QueryEntity<string>(criteria.SpParam);
            }

            result.Data = GetLicensee(criteria.LicenseeName);
            result.IsSuccess = result.Data != null;

            WriteInsertLicenseeActionLog(criteria);

            return result;
        }

        public Licensee GetLicensee(string licenseeName)
        {
            var result = Search(new LicenseeCriteria { LicenseeName = licenseeName, IsAll = false, PageIndex = 1, PageSize = 1 });
            return result.Data.Any() ? result.Data.First() : null;
        }

        public IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId)
        {
            IEnumerable<LicenseeProduct> products;

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_GetOfferedProduct"))
            {
                products = db.Query<LicenseeProduct>(new { licenseeId = licenseeId });
            }

            return products;
        }

        public string OfferProduct(OfferProductCriteria criteria)
        {
            string result = null;
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_OfferProduct"))
            {
                result = db.QueryEntity<string>(criteria.SpParam);
            }

            WriteOfferProductActionLog(criteria);

            return result;
        }

        public string RemoveProduct(RemoveLicenseeProductCriteria criteria)
        {
            string result = null;
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_RemoveProduct"))
            {
                result = db.QueryEntity<string>(criteria.SpParam);
            }

            if (string.IsNullOrEmpty(result))
            {
                WriteRemoveProductActionLog(criteria);
            }

            return result;
        }

        public int AddAgent(LicenseeAgentCriteria criteria)
        {
            var result = 0;
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_AddAgent"))
            {
                result = db.QueryEntity<int>(criteria.SpParam);
            }

            WriteAddAgentActionLog(criteria);

            return result;
        }

        public ResultData<Licensee> TerminateLicensee(TerminateLicenseeCriteria criteria)
        {
            var result = new ResultData<Licensee>();
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Terminate"))
            {
                result.Error = db.QueryEntity<string>(new { LicenseeName = criteria.LicenseeName });
                result.IsSuccess = string.IsNullOrEmpty(result.Error);
            }

            result.Data = GetLicensee(criteria.LicenseeName);

            if (result.IsSuccess)
            {
                WriteTerminateLicenseeActionLog(criteria);
            }

            return result;
        }

        public IEnumerable<string> GetLrfFucntionKey(int licenseeId)
        {
            var products = GetLicenseeProducts(licenseeId);
            if (!products.Any())
            {
                return Enumerable.Empty<string>();
            }

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_LrfFunctionKey"))
            {
                return db.Query<string>(new { ProductCode = string.Join(",", products.Select(x => x.ProductCode)) });
            }
        }

        public string EnablePullService(LicenseeProductCriteria criteria, string settingName)
        {
            string result = null;

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_EnablePullService"))
            {
                result = db.QueryEntity<string>(new { LicenseeName = criteria.LicenseeName, SettingName = settingName });
            }

            WriteEnablePullServiceActionLog(criteria, settingName);

            return result;
        }

        public IEnumerable<CurrencyItem> GetSuperCurrency(string superWildCard)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_SuperCurrency_Select"))
            {
                return db.Query<CurrencyItem>(new { SuperWildCard = superWildCard });
            }
        }

        public IEnumerable<string> GetIntegrateSetting(int licenseeId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_GetIntegrationSetting"))
            {
                return db.Query<string>(new { LicenseeId = licenseeId });
            }
        }

        private void WriteTerminateLicenseeActionLog(TerminateLicenseeCriteria criteria)
        {
            var doing = $"<Licensee>{criteria.LicenseeName}</Licensee>";

            WriteLog(ActionLogType.Licensee_Terminate, "Nap_LM_Licensee_Terminate", doing, criteria.RedmineId);
        }

        private void WriteRemoveProductActionLog(RemoveLicenseeProductCriteria criteria)
        {
            var doing = "<Product"
                        + $" LicenseeNameList=\"{criteria.LicenseeName}\""
                        + $" IsRemovePullService=\"{criteria.IsRemovePullService}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>";

            WriteLog(ActionLogType.Licensee_RemoveProduct, "Nap_LM_Licensee_RemoveProduct", doing, criteria.RedmineId);
        }

        private void WriteEnablePullServiceActionLog(LicenseeProductCriteria criteria, string settingName)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" SettingName=\"{settingName}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>";

            WriteLog(ActionLogType.Licensee_AddPullService, "Nap_LM_Licensee_EnablePullService", doing, criteria.RedmineId);
        }

        private void WriteInsertLicenseeActionLog(SetUpNewLicenseeCriteria criteria)
        {
            var doing = "<Licensee"
                        + $" SuperWildCard=\"{criteria.SuperWildCard}\""
                        + $" LicenseeType=\"{criteria.LicenseeType}\""
                        + $" IsSpecial=\"{criteria.IsSpecial}\""
                        + $" ProductCode=\"{criteria.ProductCode}\""
                        + $" SystemIsActive=\"{criteria.SystemIsActive}\""
                        + $" IsAllowMemberComm=\"{criteria.IsAllowMemberComm}\""
                        + $" EffectiveDate=\"{criteria.EffectiveDate.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + ">"
                        + criteria.LicenseeName
                        + "</Licensee>";

            WriteLog(ActionLogType.Licensee_Insert, "Nap_LM_Licensee_Insert", doing, criteria.RedmineId);
        }

        private void WriteAddAgentActionLog(LicenseeAgentCriteria criteria)
        {
            var doing = "<Agent"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" SuperWildCard=\"{criteria.SuperWildCard}\""
                        + $" IsSpecial=\"{criteria.IsSpecial}\""
                        + $" Currency=\"{criteria.Currency}\""
                        + ">"
                        + "</Agent>";

            WriteLog(ActionLogType.Licensee_AddAgent, "Nap_LM_Licensee_AddAgent", doing, criteria.RedmineId);
        }

        private void WriteOfferProductActionLog(OfferProductCriteria criteria)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" EffectiveDate=\"{criteria.EffectiveDate?.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>";

            WriteLog(ActionLogType.Licensee_OfferProduct, "Nap_LM_Licensee_OfferProduct", doing, criteria.RedmineId);
        }

        private void WriteLog(ActionLogType action, string sp, string licensee, string redmineId)
        {
            var user = AppSession.CurrentUser;
            var doing = $"<Action value=\"{action.ToString()}\">"
                + $"<RedmineId>{redmineId}</RedmineId>"
                + $"<SpName>{sp}</SpName>"
                + $"<UpdatedBy UserId=\"{user.Id}\" UserName=\"{user.Username}\" />"
                + licensee
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