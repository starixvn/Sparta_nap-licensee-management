namespace Fanex.NAP.Licensee.Service
{
    using Fanex.NAP.Licensee.Model.Criteria.LicenseeBetSetting;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.LicenseeBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.Log;

    public interface ILicenseeBetSettingService
    {
        ResultInfo UpdateBetSettingSportsbook(UpdateBetSettingSportsbookItem item);

        ResultInfo CheckBetSettingSportsbook(CheckBetSettingSportsbookItem item);

        BSSportsbookItemWithSuperInfo GetBSSportsbookItemWithSuperInfo(int custId, int productId, int agentId, bool option);

        PagedList<LogField> GetLogs(GetSettingLogViewModel model);
    }
}
