namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.LicenseeBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.Log;
    using Model.ViewModel.LicenseeBetSetting;

    public interface ILicenseeBetSettingService
    {
        ResultInfo UpdateBetSettingSportsbook(BSSportsbookViewModel model);

        List<BSResultViewModel> CheckBetSettingSportsbook(BSSportsbookViewModel model);

        BSSportsbookItemWithSuperInfo GetBSSportsbookItemWithSuperInfo(LicenseeBetSettingFilterViewModel model);

        PagedList<LogField> GetLogs(GetSettingLogViewModel model);
    }
}
