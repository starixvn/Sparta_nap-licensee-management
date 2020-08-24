namespace Fanex.NAP.Licensee.Service
{
    using Fanex.NAP.Licensee.Model.Criteria.BetTicketVolumeControlSetting;
    using Fanex.NAP.Licensee.Model.DTO;
    using System.Collections.Generic;

    public interface IBetTicketVolumeControlService
    {
        IEnumerable<Brand> GetSiteNames();

        ResultGridData<ProductVolumeControlSetting> GetVolumeControlSettingList(SearchVolumeControlSettingCriteria criteria);

        ResultInfo InsertOrUpdateVolumeControlSetting(InsUpdateVolumeControlSettingCriteria criteria);
    }
}