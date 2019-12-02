// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using Fanex.Common;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class SettingConfigurationService : ISettingConfigurationService
    {
        public string GetPositionTaking(int custId, int productId)
        {
            using (var db = new ObjectDb("NAP_LM_LicenseePositionTakingSel"))
            {
                return db.ExecuteScalar(new { CustID = custId, Product = productId }).ToString();
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
            using (var db = new ObjectDb("NAP_LM_LicenseePositionTakingUpd"))
            {
                db.AddInParameter("CustID", DbType.Int32, custId);
                db.AddInParameter("SportType", DbType.Int32, productId);
                db.AddInParameter("ptVALUE", DbType.Decimal, positionTakingValue);
                AddResultParameters(db);

                db.ExecuteNonQuery();

                return GetResults(db);
            }
        }

        public IList<T> GetBetSetting<T>(int custId, int productId)
        {
            using (var db = new ObjectDb("NAP_LM_LicenseeBetSettingSel"))
            {
                return db.Query<T>(new { CustID = custId, Product = productId }).ToList();
            }
        }

        /// <summary>
        /// Update bet setting.
        /// </summary>
        /// <param name="updBSItem">Update bet setting item.</param>
        /// <returns>Result info.</returns>
        public ResultInfo UpdateBetSetting(UpdateBetSettingItem updBSItem)
        {
            using (var db = new ObjectDb(updBSItem.GetSettingKey()))
            {
                db.ExecuteNonQuery(updBSItem.GetSpParams());
                return GetResults(db);
            }
        }

        private static void AddResultParameters(ObjectDb db)
        {
            db.AddOutParameter("@errcode", System.Data.DbType.Int32, 4);
            db.AddOutParameter("@errmsg", System.Data.DbType.String, 4000);
        }

        private static ResultInfo GetResults(ObjectDb db)
        {
            return new ResultInfo
            {
                IsOk = Converter.ToInt(db.GetParameterValue("@ErrCode")) == 0,
                Message = Converter.ToString2(db.GetParameterValue("@ErrMsg"))
            };
        }
    }
}