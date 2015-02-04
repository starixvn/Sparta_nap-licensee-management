// -----------------------------------------------------------------------
// <copyright file="ISettingConfigurationService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.SettingConfiguration;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface ISettingConfigurationService
    {
        string GetPositionTaking(int custId, int productId);

        ResultInfo UpdatePositionTaking(int custId, int productId, float positionTakingValue);

        IList<CommItem> GetCommList(int custId);

        ResultInfo UpdateComm(int custId, int sportTypeId, int betTypeId, float commValue);

        IList<T> GetBetSetting<T>(int custId, int productId);
    }
}
