namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
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
            vendor.ExclusionList = string.IsNullOrWhiteSpace(exclusion) ? null : JsonConvert.DeserializeObject<string[]>(exclusion);

            return vendor;
        };

        public LicenseeVendorService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public IEnumerable<LicenseeVendor> GetVendorList(VendorSearchingCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_Select"))
            {
                return db.Query(
                    _mapLicenseeVendor,
                    "Exclusions",
                    criteria.GetSpParams());
            }
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
    }
}