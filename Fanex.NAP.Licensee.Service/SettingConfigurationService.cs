// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Linq;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class SettingConfigurationService : ISettingConfigurationService
    {
        private const int SuccessCode = 0;

        public string GetPositionTaking(int custId, int productId)
        {
            using (var db = new ObjectDb("NAP_LM_LicenseePositionTakingSel"))
            {
                object obj = db.ExecuteScalar(new { CustID = custId, Product = productId });
                return obj.ToString();
            }
        }

        /// <summary>
        /// Update position taking.
        /// </summary>
        /// <param name="custId">Customer Id.</param>
        /// <param name="productId">Product Id.</param>
        /// <param name="positionTakingValue">Position taking value.</param>
        /// <returns>Result info.</returns>
        public ResultInfo UpdatePositionTaking(int custId, int productId, float positionTakingValue)
        {
            var result = new ResultInfo();

            using (var db = new ObjectDb("NAP_LM_LicenseePositionTakingUpd"))
            {
                db.ExecuteNonQuery(new { CustID = custId, SportType = productId, ptVALUE = positionTakingValue });

                result.IsOk = db.GetParameterValue("ErrCode").Equals(SuccessCode);
                var msg = db.GetParameterValue("ErrMsg");
                result.Message = msg != null ? msg.ToString() : string.Empty;
            }

            return result;
        }
    }
}