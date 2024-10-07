namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Common;
    using Constants;
    using Core;
    using Model.Criteria.Subsidiary;
    using Model.DTO;
    using Model.DTO.Subsidiary;
    using ShardDb;

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
            using (var db = _objectDbGenerator.Create(ShardInfoAccessor.ToShardCustDbSp(criteria.GetSettingKey())))
            {
                db.ExecuteNonQuery(criteria);
                var outputParams = db.GetOutputParams();
                var isSuccess = Converter.ToInt(outputParams[ServiceConstant.ErrCode]) == 0;

                return new ResultData<SubsidiaryAccount>
                {
                    Error = Converter.ToString2(outputParams[ServiceConstant.ErrMsg]),
                    IsSuccess = isSuccess,
                    Data = new SubsidiaryAccount
                    {
                        Username = criteria.Username,
                        CustomerId = Converter.ToInt(outputParams[ServiceConstant.CustomerId]),
                        ExistedCustomerId = Converter.ToInt(outputParams[ServiceConstant.ExistedCustId])
                    }
                };
            }
        }

        public ResultData<int> RegisterCustomer(RegisterCustomerCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                db.ExecuteNonQuery(criteria);
                var outputParams = db.GetOutputParams();
                var isSuccess = Converter.ToInt(outputParams[ServiceConstant.ErrCode]) == 0;

                return new ResultData<int>
                {
                    Error = Converter.ToString2(outputParams[ServiceConstant.ErrMsg]),
                    IsSuccess = isSuccess,
                    Data = Converter.ToInt(outputParams[ServiceConstant.CustomerId])
                };
            }
        }

        public AccountInfo CheckExistedAccount(CheckExistedAccountCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(ShardInfoAccessor.ToShardCustDbSp(criteria.GetSettingKey())))
            {
                db.ExecuteNonQuery(criteria);
                var outputParams = db.GetOutputParams();

                return new AccountInfo
                {
                    CustId = Converter.ToInt(outputParams[ServiceConstant.CustomerId]),
                    MRecommend = Converter.ToInt(outputParams[ServiceConstant.MRecommend])
                };
            }
        }

        public void RollbackCreateSubsidiary(RollbackCreateSubsidiaryCommand command)
        {
            using (var db = _objectDbGenerator.Create(command.GetSettingKey()))
            {
                db.ExecuteNonQuery(command);
            }
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

        public ResultInfo InsertCompanyWinLimit(InsertCompanyWinLimitCommand command)
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

        public ShardDbConfig GetShardDbConfig(GetShardDbConfigCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                var result = db.QueryEntity<ShardDbConfig>(criteria);

                return result;
            }
        }
    }
}