// -----------------------------------------------------------------------
// <copyright file="IBetSettingService.cs" company="">
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
    using Fanex.NAP.Licensee.Model.Criteria;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface IBetSettingService
    {
         IList<DefaultBetSetting> GetDefaultBetSettings(DefaultBetSettingCriteria criteria);
    }
}
