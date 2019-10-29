namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.Criteria.Vendor;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.Enumerations;
    using Fanex.NAP.Licensee.Service.Core;
    using Newtonsoft.Json;

    public class LicenseeVendorService : ILicenseeVendorService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        private readonly Func<LicenseeVendor, string, LicenseeVendor> _mapLicenseeVendor = (vendor, exclusion) =>
        {
            vendor.ExclusionList = exclusion?.Split('"', ',').Where(x => x != "]" && x != "[" && !string.IsNullOrEmpty(x));

            return vendor;
        };

        public LicenseeVendorService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public ResultGridData<LicenseeVendor> GetVendorList(VendorSearchingCriteria criteria)
        {
            var result = new ResultGridData<LicenseeVendor>();

            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_Select"))
            {
                result.Data = db.Query(
                    _mapLicenseeVendor,
                    "Exclusions",
                    criteria);
            }

            result.TotalItem = criteria.TotalItem;

            return result;
        }

        public LicenseeVendor GetVendorById(string vendorId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_SelectById"))
            {
                return db.QueryEntity(
                     _mapLicenseeVendor,
                    "Exclusions",
                    new { vendorId });
            }
        }

        public bool UpdateVendor(LicenseeVendor vendor)
        {
            var result = true;
            try
            {
                var oldValue = GetVendorById(vendor.VendorId);
                var exclusions = SerializeExclusions(vendor.ExclusionList);

                using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_Update"))
                {
                    db.ExecuteNonQuery(new
                    {
                        vendor.VendorId,
                        vendor.LrfUrl,
                        vendor.AffiliateUrl,
                        Exclusions = exclusions
                    });
                }

                WriteActionLog(oldValue, vendor);
            }
            catch (Exception exception)
            {
                Logging.LogService.Error(exception.Message, exception);
                result = false;
            }

            return result;
        }

        public IEnumerable<string> GetFunctionKeyList()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_VendorFunction_Select"))
            {
                return db.Query<string>();
            }
        }

        public ResultData<string> UpdateUserPassword(LAPUserCriteria criteria)
        {
            var result = new ResultData<string>();

            var userInfo = GetUserInfo(criteria.SiteName, criteria.UserID);
            var parameter = new
            {
                UserSEQ = userInfo.UserSEQ,
                UserPWD = criteria.UserPWD
            };

            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_UpdatePW"))
            {
                result.IsSuccess = db.QueryEntity<int>(parameter) == 1;
            }

            WriteUpdateUserPWActionLog(criteria);

            return result;
        }

        public UserInfo GetUserInfo(string siteName, string userID)
        {
            var parameter = new
            {
                UserID = userID,
                SiteName = siteName
            };
            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_SelectSingle"))
            {
                return db.QueryEntity<UserInfo>(parameter);
            }
        }

        public ResultData<int> AddUser(LAPUserCriteria criteria)
        {
            var result = new ResultData<int>();
            var parameter = new
            {
                UserID = criteria.UserID,
                SiteName = criteria.SiteName,
                UserPWD = criteria.UserPWD,
                UserName = criteria.UserID,
                Email = criteria.Email ?? string.Empty,
                isEnabled = 1,
                isAdmin = 1
            };

            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_Insert"))
            {
                result.IsSuccess = db.QueryEntity<int>(parameter) == 1;
            }

            WriteAddUserActionLog(criteria);

            return result;
        }

        public IEnumerable<UserInfo> GetITSupportAccount()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LAPUser_GetITSupportAccount"))
            {
                return db.Query<UserInfo>();
            }
        }

        private void WriteActionLog(LicenseeVendor oldValue, LicenseeVendor newValue)
        {
            var userId = AppSession.CurrentUser.Id;

            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)ActionLogType.UpdateLapVendorInfo,
                CustId = userId,
                UserId = userId,
                Doing = BuildUpdatingLogContent(oldValue, newValue)
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }

        private string BuildUpdatingLogContent(LicenseeVendor oldValue, LicenseeVendor newValue)
        {
            var result = new StringBuilder();

            var oldExclusions = SerializeExclusions(oldValue.ExclusionList);
            var newExclusions = SerializeExclusions(newValue.ExclusionList);

            result.Append("<Action value=\"UpdateLapVendorInfo\">");
            result.Append("<SpName>Nap_LM_LicVendorInfo_Update</SpName>");
            result.Append($"<UpdatedBy UserId=\"{AppSession.CurrentUser.Id}\" UserName=\"{AppSession.CurrentUser.Username}\" />");
            result.Append($"<Vendor Id=\"{newValue.VendorId}\" Name=\"{newValue.SiteName}\" />");
            result.Append($"<Old LrfUrl=\"{oldValue.LrfUrl}\" AffiliateUrl=\"{oldValue.AffiliateUrl}\" />");
            result.Append($"<OldExclusions>{oldExclusions}</OldExclusions>");
            result.Append($"<New LrfUrl=\"{newValue.LrfUrl}\" AffiliateUrl=\"{newValue.AffiliateUrl}\" />");
            result.Append($"<NewExclusions>{newExclusions}</NewExclusions>");
            result.Append("</Action>");

            return result.ToString();
        }

        private string SerializeExclusions(IEnumerable<string> exclusionList)
        {
            return exclusionList != null
                ? JsonConvert.SerializeObject(exclusionList)
                : null;
        }

        private void WriteAddUserActionLog(LAPUserCriteria value)
        {
            var userId = AppSession.CurrentUser.Id;

            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)ActionLogType.LAP_AddUser,
                CustId = userId,
                UserId = userId,
                Doing = BuildAddingUserLogContent(value)
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }

        private string BuildAddingUserLogContent(LAPUserCriteria value)
        {
            var result = new StringBuilder();

            result.Append("<Action value=\"AddNewUser\">");
            result.Append("<SpName>Nap_LM_LAPUser_Insert</SpName>");
            result.Append($"<CreatedBy UserId=\"{AppSession.CurrentUser.Id}\" UserName=\"{AppSession.CurrentUser.Username}\" />");
            result.Append($"<New UserID =\"{value.UserID}\" SiteName =\"{value.SiteName}\" />");
            result.Append("</Action>");

            return result.ToString();
        }

        private void WriteUpdateUserPWActionLog(LAPUserCriteria value)
        {
            var userId = AppSession.CurrentUser.Id;

            var actionLogCriteria = new ActionLogCriteria
            {
                ActionId = (int)ActionLogType.LAP_UpdateUserPWD,
                CustId = userId,
                UserId = userId,
                Doing = BuildUpdatingUserPWLogContent(value)
            };

            _logWriter.WriteActionLog(actionLogCriteria);
        }

        private string BuildUpdatingUserPWLogContent(LAPUserCriteria value)
        {
            var result = new StringBuilder();

            result.Append("<Action value=\"UpdateUserPassword\">");
            result.Append("<SpName>Nap_LM_LAPUser_UpdatePW</SpName>");
            result.Append($"<UpdatedBy UserId=\"{AppSession.CurrentUser.Id}\" UserName=\"{AppSession.CurrentUser.Username}\" />");
            result.Append($"<RequestBy =\"{value.RequestBy}\" />");
            result.Append($"<RedmineID =\"{value.RedmineID}\" />");
            result.Append($"<UserID=\"{value.UserID}\" SiteName =\"{value.SiteName}\" />");
            result.Append("</Action>");

            return result.ToString();
        }
    }
}