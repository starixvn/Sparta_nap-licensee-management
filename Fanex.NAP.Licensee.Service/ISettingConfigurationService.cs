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

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface ISettingConfigurationService
    {
        string GetPositionTaking(int custId, int productId);

        ResultInfo UpdatePositionTaking(int custId, int productId, float positionTakingValue); 
    }
}
