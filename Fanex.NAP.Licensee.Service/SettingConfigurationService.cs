// -----------------------------------------------------------------------
// <copyright file="SettingConfiguration.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using Fanex.Data;
    using System.Linq;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class SettingConfigurationService : ISettingConfigurationService
    {
        public string GetPositionTaking(int cusId, int productId)
        {
            using (var db = new ObjectDb("NAP_LM_LicenseePositionTakingSel"))
            {
                object obj = db.ExecuteScalar(new { CustID = cusId, Product = productId });
                return obj.ToString();
            }
        }
    }
}