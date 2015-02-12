// -----------------------------------------------------------------------
// <copyright file="SettingConfigurationService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

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
                db.AddInParameter("CustID", DbType.Int32, custId);
                db.AddInParameter("SportType", DbType.Int32, productId);
                db.AddInParameter("ptVALUE", DbType.Double, positionTakingValue);
                db.AddOutParameter("errcode", DbType.Int32, 8);
                db.AddOutParameter("errmsg", DbType.String, int.MaxValue);

                db.ExecuteNonQuery();

                var outputValues = db.GetOuputParams();
                if (outputValues["errcode"] == null)
                {
                    result.IsOk = true;
                    result.Message = string.Empty;
                }
                else
                {
                    result.IsOk = false;
                    result.Message = outputValues["errmsg"].ToString();
                }
            }

            return result;
        }

        public IList<CommItem> GetCommList(int custId)
        {
            using (var db = new ObjectDb("NAP_LM_LicenseeCommissionSel"))
            {
                return db.Query<CommItem>(new { CustID = custId }).ToList();
            }
        }

        /// <summary>
        /// Update commission.
        /// </summary>
        /// <param name="custId">Customer Id.</param>
        /// <param name="sportTypeId">Sport type Id.</param>
        /// <param name="betTypeId">Bet type Id.</param>
        /// <param name="commValue">Commission value.</param>
        /// <returns>Result info.</returns>
        public ResultInfo UpdateComm(int custId, int sportTypeId, int betTypeId, float commValue)
        {
            var result = new ResultInfo();

            using (var db = new ObjectDb("NAP_LM_LicenseeCommissionUpd"))
            {
                db.AddInParameter("CustID", DbType.Int32, custId);
                db.AddInParameter("Sporttype", DbType.Int32, sportTypeId);
                db.AddInParameter("Bettype", DbType.Int32, betTypeId);
                db.AddInParameter("Discount", DbType.Double, commValue);

                db.AddOutParameter("errcode", System.Data.DbType.Int32, 8);
                db.AddOutParameter("errmsg", System.Data.DbType.String, int.MaxValue);

                db.ExecuteNonQuery();

                var outputValues = db.GetOuputParams();
                if (outputValues["errcode"] == DBNull.Value)
                {
                    result.IsOk = true;
                    result.Message = string.Empty;
                }
                else
                {
                    result.IsOk = false;
                    result.Message = outputValues["errmsg"].ToString();
                }
            }

            return result;
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
            var result = new ResultInfo();

            using (var db = new ObjectDb("NAP_LM_LicenseeBetSettingUpd"))
            {
                db.AddInParameter("CustID", DbType.Int32, updBSItem.CustId);
                db.AddInParameter("Sporttype", DbType.Int32, updBSItem.SportType);
                db.AddInParameter("Bettype", DbType.Int32, updBSItem.BetType);

                db.AddInParameter("MinBet", DbType.Double, updBSItem.MinBet);
                db.AddInParameter("MaxBet", DbType.Double, updBSItem.MaxBet);
                db.AddInParameter("MaxPerMatch", DbType.Double, updBSItem.MaxPerMatch);

                db.AddInParameter("MaxPerBall", DbType.Double, updBSItem.MaxPerBall);

                db.AddInParameter("ExistedMember", DbType.Boolean, updBSItem.ExistedMember);
                db.AddInParameter("Enable", DbType.Boolean, updBSItem.Enable);
                db.AddInParameter("EnableDownline", DbType.Boolean, updBSItem.EnableDownline);

                db.AddOutParameter("errcode", DbType.Int32, 8);
                db.AddOutParameter("errmsg", DbType.String, int.MaxValue);

                var data = db.ExecuteNonQuery();

                var test = db.GetParameterValue("ErrCode");

                var outputValues = db.GetOuputParams();
                if (outputValues["@ErrCode"] == null)
                {
                    result.IsOk = true;
                    result.Message = string.Empty;
                }
                else
                {
                    result.IsOk = false;
                    result.Message = outputValues["@ErrMsg"].ToString();
                }
            }

            return result;
        }
    }
}