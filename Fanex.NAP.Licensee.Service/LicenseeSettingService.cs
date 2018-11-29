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

        private readonly IDictionary<string, string> _pullServiceSetting = new Dictionary<string, string>
        {
            { ProductCode.AGCasino, "AGCasino_VersionKey" },
            { ProductCode.GoldDeluxe, "GoldDeluxe_VersionKey" },
        };

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
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Insert"))
            {
                db.ExecuteNonQuery(criteria);
            }

            var licensee = GetLicensee(criteria.LicenseeName);

            WriteInsertLicenseeActionLog(criteria, userId);

            return new ResultData<Licensee>
            {
                IsSuccess = licensee != null,
                Data = licensee
            };
        }

        public Licensee GetLicensee(string licenseeName)
        {
            return Search(new LicenseeCriteria { LicenseeName = licenseeName, IsAll = false }).FirstOrDefault();
        }

        public IEnumerable<LicenseeProduct> GetLicenseeProducts(int licenseeId, bool showPullServiceSetting = false)
        {
            IEnumerable<LicenseeProduct> products;

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_GetOfferedProduct"))
            {
                products = db.Query<LicenseeProduct>(new { licenseeId = licenseeId });
            }

            if (!showPullServiceSetting)
            {
                return products;
            }

            var integrateSettings = GetIntegrateSetting(licenseeId);

            foreach (var setting in _pullServiceSetting)
            {
                var product = products.FirstOrDefault(x => x.ProductCode == setting.Key);
                if (product != null)
                {
                    product.PullServiceKey = setting.Value;
                    product.EnablePullService = integrateSettings.Contains(setting.Value);
                }
            }

            return products;
        }

        public void OfferProduct(OfferProductCriteria criteria, int userId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_OfferProduct"))
            {
                db.ExecuteNonQuery(criteria);
            }

            WriteOfferProductActionLog(criteria, userId);
        }

        public bool RemoveProduct(RemoveLicenseeProductCriteria criteria, int userId)
        {
            var result = false;
            var pullServiceKey = string.Empty;
            if (criteria.IsRemovePullService)
            {
                _pullServiceSetting.TryGetValue(criteria.ProductCode, out pullServiceKey);
            }

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_RemoveProduct"))
            {
                result = db.QueryEntity<int>(new
                {
                    LicenseeName = criteria.LicenseeName,
                    ProductCode = criteria.ProductCode,
                    PullServiceKey = pullServiceKey
                }) == 1;
            }

            if (result)
            {
                WriteRemoveProductActionLog(criteria, userId);
            }

            return result;
        }

        public void AddAgent(LicenseeAgentCriteria criteria, int userId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_AddAgent"))
            {
                db.ExecuteNonQuery(criteria);
            }

            WriteAddAgentActionLog(criteria, userId);
        }

        public ResultData<Licensee> TerminateLicensee(string licenseeName, int userId)
        {
            var result = new ResultData<Licensee>();

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Terminate"))
            {
                result.IsSuccess = db.QueryEntity<int>(new { LicenseeName = licenseeName }) == 1;
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

        public bool EnablePullService(LicenseeProductCriteria criteria, int userId)
        {
            if (!_pullServiceSetting.ContainsKey(criteria.ProductCode))
            {
                return false;
            }

            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_EnablePullService"))
            {
                db.ExecuteNonQuery(new { LicenseeName = criteria.LicenseeName, SettingName = _pullServiceSetting[criteria.ProductCode] });
            }

            WriteEnablePullServiceActionLog(criteria, userId);

            return true;
        }

        private IEnumerable<string> GetIntegrateSetting(int licenseeId)
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

        private void WriteRemoveProductActionLog(RemoveLicenseeProductCriteria criteria, int userId)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" IsRemovePullService=\"{criteria.IsRemovePullService}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>";

            WriteLog(ActionLogType.Licensee_RemoveProduct, "Nap_LM_Licensee_RemoveProduct", doing, userId);
        }

        private void WriteEnablePullServiceActionLog(LicenseeProductCriteria criteria, int userId)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
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