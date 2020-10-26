namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DTO;

    public interface ISettingConfigurationService
    {
        string GetPositionTaking(int custId, int productId);

        ResultInfo UpdatePositionTaking(int custId, int productId, float positionTakingValue);

        IList<T> GetBetSetting<T>(int custId, int productId);

        ResultInfo UpdateBetSetting(UpdateBetSettingItem updBSItem);
    }
}
