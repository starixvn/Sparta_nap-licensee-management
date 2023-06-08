namespace Fanex.NAP.Licensee.Service
{
    using Data;
    using Fanex.Common;
    using Fanex.NAP.Licensee.Model.Criteria.LicenseeBetSetting;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.LicenseeBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.Log;
    using Fanex.NAP.Licensee.Service.Constants;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class LicenseeBetSettingService : ILicenseeBetSettingService
    {
        public BSSportsbookItemWithSuperInfo GetBSSportsbookItemWithSuperInfo(int custId, int productId, int agentId, bool option)
        {
            IEnumerable<BSSportsbookItem> bSSupers;
            IEnumerable<BSSportsbookItem> bSAgents;

            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeBetSettingSel"))
            {
                using (var multi = db.QueryMultiple(new { CustID = custId, Product = productId, AgentID = agentId }))
                {
                    bSSupers = multi.Read<BSSportsbookItem>();
                    bSAgents = multi.Read<BSSportsbookItem>();
                }
            }

            if (option && agentId != 0)
            {
                bSSupers = bSAgents;
            }

            var result = new BSSportsbookItemWithSuperInfo
            {
                AgentItems = (List<BSSportsbookItem>)bSAgents,
                SuperItems = (List<BSSportsbookItem>)bSSupers
            };

            return result;
        }

        public PagedList<LogField> GetLogs(GetSettingLogViewModel model)
        {
            var pageSize = model.PageSize == 0 ? 10 : model.PageSize;
            var pageIndex = model.PageIndex == 0 ? 0 : model.PageIndex;

            var criteria = new GetSettingLogCriteria
            {
                CustId = model.CustId,
                AgentId = model.AgentId,
                FromDate = Convert.ToDateTime($"{model.FromDate} {DateTimeConstants.StartOfDayTime}"),
                ToDate = Convert.ToDateTime($"{model.ToDate} {DateTimeConstants.EndOfDayTime}"),
                PageSize = pageSize,
                PageIndex = pageIndex,
                ActionTypeId = 3,
                IsInternal = true,
                LowerActionId = 5574,
                UpperActionId = 5575
            };

            using (var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey()))
            {
                var data = db.Query<LogField>(criteria);
                var outputParams = db.GetOutputParams();

                var result = new PagedList<LogField>
                {
                    Data = data,
                    TotalItem = Converter.ToInt(outputParams["TotalItems"]),
                    PageSize = pageSize,
                    PageIndex = pageIndex
                };

                return result;
            }
        }

        public ResultInfo CheckBetSettingSportsbook(CheckBetSettingSportsbookItem item)
        {
            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeBetSettingCheck"))
            {
                db.ExecuteNonQuery(item);

                return new ResultInfo
                {
                    Code = Converter.ToInt(item.ErrCode),
                    IsOk = Converter.ToInt(item.ErrCode) == 0,
                    Message = item.ErrMsg
                };
            }
        }

        public ResultInfo UpdateBetSettingSportsbook(UpdateBetSettingSportsbookItem item)
        {
            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeBetLimitUpd"))
            {
                db.ExecuteNonQuery(item);

                return new ResultInfo
                {
                    IsOk = Converter.ToInt(item.ErrCode) == 0,
                    Message = item.ErrMsg
                };
            }
        }
    }
}