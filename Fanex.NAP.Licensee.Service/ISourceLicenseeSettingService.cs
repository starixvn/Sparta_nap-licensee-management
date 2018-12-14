namespace Fanex.NAP.Licensee.Service
{
    using Model.Criteria.SourceLicenseeSetting;
    using Model.DTO;

    public interface ISourceLicenseeSettingService
    {
        ResultGridData<SourceLicensee> Search(SearchSourceLicenseeCriteria criteria, string sp = "Nap_LM_SourceLicensee_Select");

        ResultGridData<SourceLicenseeSettingResult> Add(NewSourceLicenseeCriteria criteria);
    }
}