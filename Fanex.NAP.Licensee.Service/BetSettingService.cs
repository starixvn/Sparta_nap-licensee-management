// -----------------------------------------------------------------------
// <copyright file="BetSettingService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DTO;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class BetSettingService : IBetSettingService
    {
        private const int SuccessCode = 0;

        public IList<DefaultBetSetting> GetAll(Model.Criteria.DefaultBetSettingCriteria criteria)
        {
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                return db.Query<DefaultBetSetting>(criteria.GetSpParams()).ToList();
            }
        }

        public bool Delete(DeletingDefaultBetSettingCriteria criteria)
        {
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                db.ExecuteReader(criteria.GetSpParams());
                return db.GetParameterValue("@errcode").Equals(SuccessCode);
            }
        }
    }
}