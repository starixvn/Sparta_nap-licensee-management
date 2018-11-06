using System;
using System.Collections.Generic;
using System.Text;
using Fanex.NAP.Licensee.Model.Criteria.Vendor;
using Fanex.NAP.Licensee.Model.DTO;
using Fanex.NAP.Licensee.Model.Enumerations;
using Fanex.NAP.Licensee.Service.Core;

namespace Fanex.NAP.Licensee.Service
{
    public class LicenseeVendorService : ILicenseeVendorService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public LicenseeVendorService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public IEnumerable<LicenseeVendor> GetVendorList(VendorSearchingCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_Select"))
            {
                return db.Query<LicenseeVendor>(criteria.GetSpParams());
            }
        }

        public LicenseeVendor GetVendorById(string vendorId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_SelectById"))
            {
                return db.QueryEntity<LicenseeVendor>(new { vendorId });
            }
        }

        public bool UpdateVendor(LicenseeVendor vendor)
        {
            var result = true;
            try
            {
                var oldValue = GetVendorById(vendor.VendorId);

                using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_Update"))
                {
                    db.ExecuteNonQuery(new
                    {
                        vendor.VendorId,
                        vendor.LrfUrl,
                        vendor.AffiliateUrl,
                        vendor.Exclusions
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

            result.Append("<Action value=\"UpdateLapVendorInfo\">");
            result.Append("<SpName>Nap_LM_LicVendorInfo_Update</SpName>");
            result.Append($"<UpdatedBy UserId=\"{AppSession.CurrentUser.Id}\" UserName=\"{AppSession.CurrentUser.Username}\" />");
            result.Append($"<Vendor Id=\"{newValue.VendorId}\" Name=\"{newValue.SiteName}\" />");
            result.Append($"<Old LrfUrl=\"{oldValue.LrfUrl}\" AffiliateUrl=\"{oldValue.AffiliateUrl}\" />");
            result.Append($"<OldExclusions>{oldValue.Exclusions}</OldExclusions>");
            result.Append($"<New LrfUrl=\"{newValue.LrfUrl}\" AffiliateUrl=\"{newValue.AffiliateUrl}\" />");
            result.Append($"<NewExclusions>{newValue.Exclusions}</NewExclusions>");
            result.Append("</Action>");

            return result.ToString();
        }
    }
}