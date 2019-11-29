namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using Core;
    using Model.Criteria.LicenseeSetting;
    using Model.Criteria.Vendor;
    using Model.DTO;
    using Model.DataDomain;

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

        public IEnumerable<SystemItem> GetLicenseeSystemList(int licenseeId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_GetActiveSystem"))
            {
                return db.Query<SystemItem>(new { licenseeId = licenseeId });
            }
        }

        public ResultData<Licensee> SetUpNewLicensee(SetUpNewLicenseeCriteria criteria)
        {
            var result = new ResultData<Licensee>();
            var param = new
            {
                LicenseeName = criteria.LicenseeName,
                SuperWildCard = criteria.SuperWildCard,
                LicenseeType = criteria.LicenseeType,
                IsSpecial = criteria.IsSpecial,
                ProductCode = criteria.ProductCode,
                SystemIsActive = criteria.SystemIsActive,
                IsAllowMemberComm = criteria.IsAllowMemberComm,
                EffectiveDate = criteria.EffectiveDate,
                Description = criteria.Description,
                BrandName = criteria.BrandName ?? string.Empty,
                CompanyName = criteria.CompanyName ?? string.Empty,
                ErrMsg = string.Empty
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_Insert"))
            {
                db.ExecuteNonQuery(param);
                
            }

            result.Error = param.ErrMsg;
            result.Data = GetLicensee(criteria.LicenseeName);
            result.IsSuccess = result.Data != null;

            WriteInsertLicenseeActionLog(criteria, result.Error);

            return result;
        }

        public Licensee GetLicensee(string licenseeName)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_GetByName"))
            {
                return db.QueryEntity<Licensee>(new { LicenseeName = licenseeName });
            }
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
            var parameter = new
            {
                LicenseeName = criteria.LicenseeName,
                ProductCode = criteria.ProductCode,
                EffectiveDate = criteria.EffectiveDate,
                ErrMsg = string.Empty
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_OfferProduct"))
            {
                db.ExecuteNonQuery(parameter);
            }

            WriteOfferProductActionLog(criteria, parameter.ErrMsg);

            return parameter.ErrMsg;
        }

        public string RemoveProduct(RemoveLicenseeProductCriteria criteria)
        {
            string result = null;
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_RemoveProduct"))
            {
                result = db.QueryEntity<string>(criteria.SpParam);
            }

            WriteRemoveProductActionLog(criteria, result);

            return result;
        }

        public ResultData<int> AddAgent(LicenseeAgentCriteria criteria)
        {
            var parameter = new
            {
                LicenseeName = criteria.LicenseeName,
                SuperWildCard = criteria.SuperWildCard,
                IsSpecial = criteria.IsSpecial,
                Currency = criteria.Currency,
                AffectedRows = 0,
                ErrMsg = string.Empty
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_AddAgent"))
            {
                db.ExecuteNonQuery(parameter);
            }

            WriteAddAgentActionLog(criteria, parameter.ErrMsg);

            var result = new ResultData<int>
            {
                IsSuccess = true,
                Data = parameter.AffectedRows,
                Error = parameter.ErrMsg
            };

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

            WriteTerminateLicenseeActionLog(criteria, result.Error);

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

        public string ActivateSystem(ActivateSystemCriteria criteria)
        {
            var parameter = new
            {
                LicenseeName = criteria.LicenseeName,
                SystemName = criteria.SystemName,
                ErrMsg = string.Empty
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_Licensee_ActivateSystem"))
            {
                db.ExecuteNonQuery(parameter);
            }

            WriteActivateLicenseeActionLog(criteria, parameter.ErrMsg);

            return parameter.ErrMsg;
        }

        private void WriteTerminateLicenseeActionLog(TerminateLicenseeCriteria criteria, string error)
        {
            var doing = $"<Licensee>{criteria.LicenseeName}</Licensee>"
                        + (string.IsNullOrEmpty(error) ? string.Empty : $"<Result>{error}</Result>");

            WriteLog(ActionLogType.Licensee_Terminate, "Nap_LM_Licensee_Terminate", doing, criteria.RedmineId);
        }

        private void WriteRemoveProductActionLog(RemoveLicenseeProductCriteria criteria, string error)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" IsRemovePullService=\"{criteria.IsRemovePullService}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>"
                        + (string.IsNullOrEmpty(error) ? string.Empty : $"<Result>{error}</Result>");

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

        private void WriteInsertLicenseeActionLog(SetUpNewLicenseeCriteria criteria, string error)
        {
            var doing = "<Licensee"
                        + $" Description=\"{criteria.Description}\""
                        + $" BrandName=\"{criteria.BrandName}\""
                        + $" CompanyName=\"{criteria.CompanyName}\""
                        + $" SuperWildCard=\"{criteria.SuperWildCard}\""
                        + $" LicenseeType=\"{criteria.LicenseeType}\""
                        + $" IsSpecial=\"{criteria.IsSpecial}\""
                        + $" ProductCode=\"{criteria.ProductCode}\""
                        + $" SystemIsActive=\"{criteria.SystemIsActive}\""
                        + $" IsAllowMemberComm=\"{criteria.IsAllowMemberComm}\""
                        + $" EffectiveDate=\"{criteria.EffectiveDate.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + ">"
                        + criteria.LicenseeName
                        + "</Licensee>"
                        + (string.IsNullOrEmpty(error) ? string.Empty : $"<Result>{error}</Result>");

            WriteLog(ActionLogType.Licensee_Insert, "Nap_LM_Licensee_Insert", doing, criteria.RedmineId);
        }

        private void WriteAddAgentActionLog(LicenseeAgentCriteria criteria, string error)
        {
            var doing = "<Agent"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" SuperWildCard=\"{criteria.SuperWildCard}\""
                        + $" IsSpecial=\"{criteria.IsSpecial}\""
                        + $" Currency=\"{criteria.Currency}\""
                        + ">"
                        + "</Agent>"
                        + (string.IsNullOrEmpty(error) ? string.Empty : $"<Result>{error}</Result>");

            WriteLog(ActionLogType.Licensee_AddAgent, "Nap_LM_Licensee_AddAgent", doing, criteria.RedmineId);
        }

        private void WriteOfferProductActionLog(OfferProductCriteria criteria, string error)
        {
            var doing = "<Product"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + $" EffectiveDate=\"{criteria.EffectiveDate?.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)}\""
                        + ">"
                        + criteria.ProductCode
                        + "</Product>"
                        + (string.IsNullOrEmpty(error) ? string.Empty : $"<Result>{error}</Result>");

            WriteLog(ActionLogType.Licensee_OfferProduct, "Nap_LM_Licensee_OfferProduct", doing, criteria.RedmineId);
        }

        private void WriteActivateLicenseeActionLog(ActivateSystemCriteria criteria, string error)
        {
            var doing = "<System"
                        + $" LicenseeName=\"{criteria.LicenseeName}\""
                        + ">"
                        + criteria.SystemName
                        + "</System>"
                        + (string.IsNullOrEmpty(error) ? string.Empty : $"<Result>{error}</Result>");

            WriteLog(ActionLogType.Licensee_ActivateSystem, "Nap_LM_Licensee_ActivateSystem", doing, criteria.RedmineId);
        }

        private void WriteLog(ActionLogType action, string sp, string licensee, int redmineId)
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