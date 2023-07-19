using System.Collections.Generic;
using Fanex.NAP.Licensee.Model.Criteria.Subsidiary;
using Fanex.NAP.Licensee.Model.DTO;
using Fanex.NAP.Licensee.Model.DTO.Subsidiary;

namespace Fanex.NAP.Licensee.Service
{
    public interface ILicenseeSubsidiaryService
    {
        IEnumerable<LicenseeSubsidiaries> GetLicenseeList(LicenseeListCriteria criteria);

        string GetSourceAgent(SourceAgentCriteria criteria);

        IEnumerable<string> GenerateSubUserName(GenerateSubUserNameCriteria criteria);

        ResultData<SubsidiaryAccount> CreateLicenseeSubsidiary(CreateLicenseeSubsidiaryCriteria criteria);

        ResultInfo ExclusionsPermission(ExclusionsPermissionCommand command);

        SiteDbConfig GetSiteDb(GetSiteDbConfigCriteria criteria);

        void CheckCustList(BalanceCustomerList balanceCustomerList);
    }
}
