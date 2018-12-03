namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
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

        public IEnumerable<Licensee> Search(LicenseeCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Select"))
            {
                return db.Query<Licensee>(criteria);
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

        public ResultData<Licensee> SetUpNewLicensee(SetUpNewLicenseeCriteria criteria, int userId)
        {
            var result = new ResultData<Licensee>();
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Insert"))
            {
                result.Error = db.QueryEntity<string>(criteria);
            }

            result.Data = GetLicensee(criteria.LicenseeName);
            result.IsSuccess = result.Data != null;

            WriteInsertLicenseeActionLog(criteria, userId);

            return result;
        }

        public Licensee GetLicensee(string licenseeName)
        {
            return Search(new LicenseeCriteria { LicenseeName = licenseeName, IsAll = false }).FirstOrDefault();
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

        public string OfferProduct(OfferProductCriteria criteria, int userId)
        {
            string result = null;
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_OfferProduct"))
            {
                result = db.QueryEntity<string>(criteria);
            }

            WriteOfferProductActionLog(criteria, userId);

            return result;
        }

        public string RemoveProduct(RemoveLicenseeProductCriteria criteria, string pullServiceKey, int userId)
        {
            string result = null;
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_RemoveProduct"))
            {
                result = db.QueryEntity<string>(new
                {
                    LicenseeName = criteria.LicenseeName,
                    ProductCode = criteria.ProductCode,
                    PullServiceKey = pullServiceKey
                });
            }

            if (string.IsNullOrEmpty(result))
            {
                WriteRemoveProductActionLog(criteria, pullServiceKey, userId);
            }

            return result;
        }

        public int AddAgent(LicenseeAgentCriteria criteria, int userId)
        {
            var result = 0;
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_AddAgent"))
            {
                result = db.QueryEntity<int>(criteria);
            }

            WriteAddAgentActionLog(criteria, userId);

            return result;
        }

        public ResultData<Licensee> TerminateLicensee(string licenseeName, int userId)
        {
            var result = new ResultData<Licensee>();
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Terminate"))
            {
                result.Error = db.QueryEntity<string>(new { LicenseeName = licenseeName });
                result.IsSuccess = string.IsNullOrEmpty(result.Error);
            }

            result.Data = GetLicensee(licenseeName);

            if (result.IsSuccess)
            {
                WriteTerminateLicenseeActionLog(licenseeName, userId);
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

        public string EnablePullService(LicenseeProductCriteria criteria, string settingName, int userId)
        {
            string result = null;

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_EnablePullService"))
            {
                result = db.QueryEntity<string>(new { LicenseeName = criteria.LicenseeName, SettingName = settingName });
            }

            WriteEnablePullServiceActionLog(criteria, settingName, userId);

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

        private void WriteTerminateLicenseeActionLog(string licenseeName, int userId)
        {
            var doing = $"<Licensee>{licenseeName}</Licensee>";

            WriteLog(ActionLogType.Licensee_Terminate, "Nap_LM_Licensee_Terminate", doing, userId);
        }

        private void WriteRemoveProductActionLog(RemoveLicenseeProductCriteria criteria, string pullServiceKey, int userId)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" RemovePullService=\"{pullServiceKey}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>";

            WriteLog(ActionLogType.Licensee_RemoveProduct, "Nap_LM_Licensee_RemoveProduct", doing, userId);
        }

        private void WriteEnablePullServiceActionLog(LicenseeProductCriteria criteria, string settingName, int userId)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" SettingName=\"{settingName}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>";

            WriteLog(ActionLogType.Licensee_AddPullService, "Nap_LM_Licensee_EnablePullService", doing, userId);
        }

        private void WriteInsertLicenseeActionLog(SetUpNewLicenseeCriteria criteria, int userId)
        {
            var doing = "<Licensee"
                        + $" SuperWildCard=\"{criteria.SuperWildCard}\""
                        + $" LicenseeType=\"{criteria.LicenseeType}\""
                        + $" IsSpecial=\"{criteria.IsSpecial}\""
                        + $" ProductCode=\"{criteria.ProductCode}\""
                        + $" SystemisActive=\"{criteria.SystemisActive}\""
                        + $" IsAllowMemberComm=\"{criteria.IsAllowMemberComm}\""
                        + $" EffectiveDate=\"{criteria.EffectiveDate.ToString("MM/dd/yyyy")}\""
                        + ">"
                        + criteria.LicenseeName
                        + "</Licensee>";

            WriteLog(ActionLogType.Licensee_Insert, "Nap_LM_Licensee_Insert", doing, userId);
        }

        private void WriteAddAgentActionLog(LicenseeAgentCriteria criteria, int userId)
        {
            var doing = "<Agent"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" SuperWildCard=\"{criteria.SuperWildCard}\""
                        + $" IsSpecial=\"{criteria.IsSpecial}\""
                        + $" Currency=\"{criteria.Currency}\""
                        + ">"
                        + "</Agent>";

            WriteLog(ActionLogType.Licensee_AddAgent, "Nap_LM_Licensee_AddAgent", doing, userId);
        }

        private void WriteOfferProductActionLog(OfferProductCriteria criteria, int userId)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" EffectiveDate=\"{criteria.EffectiveDate?.ToString("MM/dd/yyyy")}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>";

            WriteLog(ActionLogType.Licensee_OfferProduct, "Nap_LM_Licensee_OfferProduct", doing, userId);
        }

        private void WriteLog(ActionLogType action, string sp, string licensee, int userId)
        {
            var doing = $"<Action value=\"{action.ToString()}\">"
                + $"<SpName>{sp}</SpName>"
                + $"<User>{userId}</User>"
                + licensee
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