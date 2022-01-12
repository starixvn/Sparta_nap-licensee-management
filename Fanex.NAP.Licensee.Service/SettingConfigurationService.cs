namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Data;
    using Fanex.Common;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    public class SettingConfigurationService : ISettingConfigurationService
    {
        public string GetPositionTaking(int custId, int productId)
        {
            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseePositionTakingSel"))
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
            var parameters = new
            {
                CustID = custId,
                Sporttype = productId,
                ptVALUE = positionTakingValue,
                @errcode = 0,
                @errmsg = string.Empty
            };

            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseePositionTakingUpd"))
            {
                db.ExecuteNonQuery(parameters);

                return new ResultInfo
                {
                    IsOk = Converter.ToInt(parameters.@errcode) == 0,
                    Message = parameters.@errmsg
                };
            }
        }

        public IList<CommItem> GetCommList(int custId)
        {
            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeCommissionSel"))
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
            var parameters = new
            {
                CustID = custId,
                Sporttype = sportTypeId,
                Bettype = betTypeId,
                Discount = commValue,
                @errcode = 0,
                @errmsg = string.Empty
            };

            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeCommissionUpd"))
            {
                db.ExecuteNonQuery(parameters);

                return new ResultInfo
                {
                    IsOk = Converter.ToInt(parameters.@errcode) == 0,
                    Message = parameters.@errmsg
                };
            }
        }

        public IList<T> GetBetSetting<T>(int custId, int productId, int agentId)
        {
            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeBetSettingSel"))
            {
                return db.Query<T>(new { CustID = custId, Product = productId, AgentID = agentId }).ToList();
            }
        }

        public BSSportbookItemWithSuperInfo GetBSSportbookItemWithSuperInfo(int custId, int productId, int agentId)
        {
            IEnumerable<BSSportbookItem> bSSupers;
            IEnumerable<BSSportbookItem> bSAgents;

            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeBetSettingSel"))
            {
                using (var multi = db.QueryMultiple(new { CustID = custId, Product = productId, AgentID = agentId }))
                {
                    bSSupers = multi.Read<BSSportbookItem>();
                    bSAgents = multi.Read<BSSportbookItem>();
                }
            }

            var result = new BSSportbookItemWithSuperInfo
            {
                AgentItems = (List<BSSportbookItem>)bSAgents,
                SuperItems = (List<BSSportbookItem>)bSSupers
            };

            return result;
        }

        /// <summary>
        /// Update bet setting.
        /// </summary>
        /// <param name="updBSItem">Update bet setting item.</param>
        /// <returns>Result info.</returns>
        public ResultInfo UpdateBetSetting(UpdateBetSettingItem updBSItem)
        {
            using (var db = ObjectDbFactory.CreateInstance(updBSItem.GetSettingKey()))
            {
                db.ExecuteNonQuery(updBSItem);

                return new ResultInfo
                {
                    IsOk = Converter.ToInt(updBSItem.ErrCode) == 0,
                    Message = updBSItem.ErrMsg
                };
            }
        }
    }
}