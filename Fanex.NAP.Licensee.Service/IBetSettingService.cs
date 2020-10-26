namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.DefaultBetSetting;

    public interface IBetSettingService
    {
        IList<DefaultBetSetting> GetAll(GetAllDefaultBetSettingCriteria criteria);

        SingleDefaultBetSettingViewModel SingleSetting(GetSingleDefaultBetSettingCriteria criteria);
      
        ResultInfo InsertOrUpdate(InsertOrUpdateDefaultBetSetting criteria);

        IList<AgentItem> GetAgents(GetAgentListCriteria criteria);

        IList<SettingLogItem> GetLogs(GetSettingLogCriteria criteria);
    }
}