// -----------------------------------------------------------------------
// <copyright file="ISettingConfigurationService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface ISettingConfigurationService
    {
        string GetPositionTaking(int custId, int productId);

        ResultInfo UpdatePositionTaking(int custId, int productId, float positionTakingValue);

        IList<T> GetBetSetting<T>(int custId, int productId);

        ResultInfo UpdateBetSetting(UpdateBetSettingItem updBSItem);
    }
}
