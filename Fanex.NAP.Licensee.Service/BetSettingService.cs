// -----------------------------------------------------------------------
// <copyright file="BetSettingService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class BetSettingService:IBetSettingService
    {
        public IList<DefaultBetSetting> GetDefaultBetSettings(Model.Criteria.DefaultBetSettingCriteria criteria)
        {
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                return db.Query<DefaultBetSetting>(criteria.GetSpParams()).ToList();
            }
        }
    }
}
