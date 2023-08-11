namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Data;
    using Fanex.Common;
    using Fanex.NAP.Licensee.Model.Criteria.LicenseeBetSetting;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.LicenseeBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.Log;
    using Fanex.NAP.Licensee.Service.Constants;
    using Model.ViewModel.LicenseeBetSetting;

    public class LicenseeBetSettingService : ILicenseeBetSettingService
    {
        private const string BSPattern = "<BL SportType=\"{0}\" Bettype=\"{1}\" MinBet=\"{2}\" MaxBet=\"{3}\" MaxPerMatch=\"{4}\" MaxPerNumber=\"{5}\" MaxPayoutPerMatch=\"{6}\"/>";
        
        public BSSportsbookItemWithSuperInfo GetBSSportsbookItemWithSuperInfo(LicenseeBetSettingFilterViewModel model)
        {
            IEnumerable<BSSportsbookItem> bSSupers;
            IEnumerable<BSSportsbookItem> bSAgents;

            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeBetSettingSel"))
            {
                using (var multi = db.QueryMultiple(new { CustID = model.CustId, Product = model.ProductTypeId, AgentID = model.AgentId }))
                {
                    bSSupers = multi.Read<BSSportsbookItem>();
                    bSAgents = multi.Read<BSSportsbookItem>();
                }
            }

            if (model.Option && model.AgentId != 0)
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

        public ResultInfo UpdateBetSettingSportsbook(BSSportsbookViewModel model)
        {
            var updateItem = new UpdateBetSettingSportsbookItem();
            FormatBetSettingSportsbookItem(updateItem, model);

            updateItem.UserId = model.UserId;
            updateItem.IP = model.IP;
            updateItem.UpdBetLimit = ToXmlSetting(model.BSRows.Count > 0 ? model.BSRows[0] : null);
            updateItem.UpdNewMember = ToXmlSetting(model.DBSRows.Count > 0 ? model.DBSRows[0] : null);

            using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeBetLimitUpd"))
            {
                db.ExecuteNonQuery(updateItem);

                return new ResultInfo
                {
                    IsOk = Converter.ToInt(updateItem.ErrCode) == 0,
                    Message = updateItem.ErrMsg
                };
            }
        }

        public List<BSResultViewModel> CheckBetSettingSportsbook(BSSportsbookViewModel model)
        {
            var updateItem = new CheckBetSettingSportsbookItem();
            FormatBetSettingSportsbookItem(updateItem, model);

            var violatedResultItems = new List<BSResultViewModel>();

            var bsRows = model.BSRows;
            var dbsRows = model.DBSRows;

            for (var i = 0; i < bsRows.Count; i++)
            {
                updateItem.UpdBetLimit = bsRows[i].IsRowSelected ? ToXmlSetting(bsRows[i]) : string.Empty;
                updateItem.UpdNewMember = (dbsRows != null && dbsRows[i].IsRowSelected) ? ToXmlSetting(dbsRows[i]) : string.Empty;

                using (var db = ObjectDbFactory.CreateInstance("NAP_LM_LicenseeBetSettingCheck"))
                {
                    db.ExecuteNonQuery(updateItem);

                    var result = new ResultInfo
                    {
                        Code = Converter.ToInt(updateItem.ErrCode),
                        IsOk = Converter.ToInt(updateItem.ErrCode) == 0,
                        Message = updateItem.ErrMsg
                    };

                    if (!result.IsOk)
                    {
                        violatedResultItems.Add(new BSResultViewModel(bsRows[i].BetTypeName, result.Code, result.IsOk, result.Message));
                    }

                    updateItem.ErrCode = 0;
                    updateItem.ErrMsg = string.Empty;
                }
            }

            return violatedResultItems
                .OrderBy(_ => LicenseeBetSettingConstants.SportsbookDBSErrCodes.Split(',').Any(code => code == _.Code.ToString()))
                .ToList();
        }

        private static void FormatBetSettingSportsbookItem(BetSettingSportsbookItemBase updateItem, BSSportsbookViewModel model)
        {
            updateItem.CustId = model.CustId;
            updateItem.ExistedMember = model.ExistedMember;
            updateItem.AgentId = model.AgentId;
            updateItem.Option = model.Option;
            updateItem.IsNewMember = model.IsNewMember;
        }

        private static string ToXmlSetting(BSRowBaseViewModel row)
        {
            if (row == null)
            {
                return string.Empty;
            }

            var xml = new StringBuilder("<ROOT>");
            xml.Append(string.Format(BSPattern, row.SportTypeId, row.BetTypeId, row.MinBet, row.MaxBet, row.MaxPerMatch, null, row.MaxPayoutPerMatch));
            xml.Append("</ROOT>");

            return xml.ToString();
        }

    }
}