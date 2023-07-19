using Fanex.Data.Repository;
using Microsoft.Ajax.Utilities;

namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    public class ExclusionsPermissionCommand : NonQueryCommand
    {
        public ExclusionsPermissionCommand(string siteName)
        {
            SiteName = siteName;
        }

        public string SiteName { get; set; }

        public override string GetSettingKey()
        {
            return "Nap_LM_LicVendorExclusionsPermission";
        }

        public override bool IsValid()
        {
            return !SiteName.IsNullOrWhiteSpace();
        }
    }
}
