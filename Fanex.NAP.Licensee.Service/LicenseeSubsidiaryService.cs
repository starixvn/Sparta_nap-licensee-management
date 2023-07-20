using System.Collections.Generic;
using Fanex.Common;
using Fanex.Common.Extensions;
using Fanex.NAP.Licensee.Model.Criteria.Subsidiary;
using Fanex.NAP.Licensee.Model.DTO;
using Fanex.NAP.Licensee.Model.DTO.Subsidiary;
using Fanex.NAP.Licensee.Service.Constants;
using Fanex.NAP.Licensee.Service.Core;
using Fanex.NAP.Licensee.Service.ShardDb;

namespace Fanex.NAP.Licensee.Service
{
    public class LicenseeSubsidiaryService : ILicenseeSubsidiaryService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;

        public LicenseeSubsidiaryService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public IEnumerable<LicenseeSubsidiaries> GetLicenseeList(LicenseeListCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                return db.Query<LicenseeSubsidiaries>();
            }
        }

        public string GetSourceAgent(SourceAgentCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                db.ExecuteNonQuery(criteria);
                var outputParams = db.GetOutputParams();
                return Converter.ToString2(outputParams[ServiceConstant.UsernameAgent]);
            }
        }

        public IEnumerable<string> GenerateSubUserName(GenerateSubUserNameCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                return db.Query<string>(criteria);
            }
        }

        public ResultData<SubsidiaryAccount> CreateLicenseeSubsidiary(CreateLicenseeSubsidiaryCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                db.ExecuteNonQuery(criteria);
                var outputParams = db.GetOutputParams();
                var isSuccess = Converter.ToInt(outputParams[ServiceConstant.ErrCode]) == 0;

                BalanceCustomerList balanceCustList = null;
                var rawUsers = Converter.ToString2(outputParams[ServiceConstant.InsertBalanceExceptCustList]);
                if (isSuccess && !rawUsers.IsNullOrTrimEmpty())
                {
                    balanceCustList = new BalanceCustomerList(rawUsers);
                }

                return new ResultData<SubsidiaryAccount>
                {
                    Error = Converter.ToString2(outputParams[ServiceConstant.ErrMsg]),
                    IsSuccess = isSuccess,
                    Data = new SubsidiaryAccount
                    {
                        Username = criteria.Username,
                        CustomerId = Converter.ToInt(outputParams[ServiceConstant.CustomerId]),
                        ExistedCustomerId = Converter.ToInt(outputParams[ServiceConstant.ExistedCustId]),
                        BalanceCustomerList = balanceCustList
                    }
                };
            }
        }

        public SiteDbConfig GetSiteDb(GetSiteDbConfigCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                var result = db.QueryEntity<SiteDbConfig>(criteria);
                return result;
            }
        }

        public void CheckCustList(BalanceCustomerList balanceCustomerList)
        {
            CheckBalanceExceptions(balanceCustomerList.ExceptCustomers);
        }

        public ResultInfo ExclusionsPermission(ExclusionsPermissionCommand command)
        {
            using (var db = _objectDbGenerator.Create(command.GetSettingKey()))
            {
                db.ExecuteNonQuery(command);
                var outputParams = db.GetOutputParams();
                return new ResultInfo
                {
                    IsOk = Converter.ToInt(outputParams[ServiceConstant.ErrCode]) == 0,
                    Message = Converter.ToString2(outputParams[ServiceConstant.ErrMsg])
                };
            }
        }

        private void CheckBalanceExceptions(List<BalanceExceptCustomer> users)
        {
            users.ForEach(user => CheckBalanceException(user.Id, user.Name));
        }

        private void CheckBalanceException(int custId, string username)
        {
            var param = new { custID = custId, username };
            var shardSettingKey = ShardInfoAccessor.ToShardSp("Task_Cust_CheckBalance_Exception_Ins");
            using (var db = _objectDbGenerator.Create(shardSettingKey))
            {
                db.ExecuteNonQuery(param);
            }
        }
    }
}
