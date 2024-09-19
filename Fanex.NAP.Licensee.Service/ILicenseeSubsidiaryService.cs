namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Model.Criteria.Subsidiary;
    using Model.DTO;
    using Model.DTO.Subsidiary;

    public interface ILicenseeSubsidiaryService
    {
        IEnumerable<LicenseeSubsidiaries> GetLicenseeList(LicenseeListCriteria criteria);

        string GetSourceAgent(SourceAgentCriteria criteria);

        IEnumerable<string> GenerateSubUserName(GenerateSubUserNameCriteria criteria);

        ResultData<SubsidiaryAccount> CreateLicenseeSubsidiary(CreateLicenseeSubsidiaryCriteria criteria);

        ResultData<int> RegisterCustomer(RegisterCustomerCriteria criteria);

        AccountInfo CheckExistedAccount(CheckExistedAccountCriteria criteria);

        void RollbackCreateSubsidiary(RollbackCreateSubsidiaryCommand command);

        ResultInfo ExclusionsPermission(ExclusionsPermissionCommand command);

        ShardDbConfig GetShardDbConfig(GetShardDbConfigCriteria criteria);
    }
}