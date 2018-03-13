using System;
using System.Collections.Generic;
using System.Text;
using Fanex.NAP.Licensee.Model.Criteria.Vendor;
using Fanex.NAP.Licensee.Model.DTO;
using Fanex.NAP.Licensee.Model.Enumerations;
using Fanex.NAP.Licensee.Service.Core;

namespace Fanex.NAP.Licensee.Service
{
    public class VendorService : IVendorService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public VendorService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public IEnumerable<Vendor> GetVendorList(VendorSearchingCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_Select"))
            {
                return db.Query<Vendor>(criteria.GetSpParams());
            }
        }

        public Vendor GetVendorById(string vendorId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_LicVendorInfo_SelectById"))
            {
                return db.QueryEntity<Vendor>(new { vendorId });
            }
        }

        public bool UpdateVendor(Vendor vendor)
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
                        vendor.InternalUrl,
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

        private void WriteActionLog(Vendor oldValue, Vendor newValue)
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

        private string BuildUpdatingLogContent(Vendor oldValue, Vendor newValue)
        {
            var result = new StringBuilder();

            result.Append("<Action value=\"UpdateLapVendorInfo\">");
            result.Append("<SpName value=\"Nap_LM_LicVendorInfo_Update\" />");
            result.Append($"<UpdatedBy UserId=\"{AppSession.CurrentUser.Id}\" UserName=\"{AppSession.CurrentUser.Username}\" />");
            result.Append($"<Vendor Id=\"{newValue.VendorId}\" Name=\"{newValue.SiteName}\" />");
            result.Append($"<Old InternalUrl=\"{oldValue.InternalUrl}\" LrfUrl=\"{oldValue.LrfUrl}\" AffiliateUrl=\"{oldValue.AffiliateUrl}\" Exclusions=\"{oldValue.Exclusions}\" />");
            result.Append($"<New InternalUrl=\"{newValue.InternalUrl}\" LrfUrl=\"{newValue.LrfUrl}\" AffiliateUrl=\"{newValue.AffiliateUrl}\" Exclusions=\"{newValue.Exclusions}\" />");
            result.Append("</Action>");

            return result.ToString();
        }
    }
}