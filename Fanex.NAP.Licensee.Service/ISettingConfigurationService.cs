namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    public interface ISettingConfigurationService
    {
        string GetPositionTaking(int custId, int productId);

        ResultInfo UpdatePositionTaking(int custId, int productId, float positionTakingValue);

        IList<T> GetBetSetting<T>(int custId, int productId, int agentId);

        ResultInfo UpdateBetSetting(UpdateBetSettingItem updBSItem);

        ResultInfo UpdateBetSettingSportsbook(BetSettingSportsbookItem item);

        ResultInfo CheckBetSettingSportsbook(BetSettingSportsbookItem item);

        BSSportbookItemWithSuperInfo GetBSSportbookItemWithSuperInfo(int custId, int productId, int agentId, bool option);
    }
}
