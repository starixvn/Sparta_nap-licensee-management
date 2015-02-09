// -----------------------------------------------------------------------
// <copyright file="SystemService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.Core
{
    using System.Collections.Generic;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.Criteria.Core;
    using Fanex.NAP.Licensee.Model.DTO.Core;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class SystemService : ISystemService
    {
        public IEnumerable<SystemInfo> GetSystemInfoList(GetSystemInfoCriteria criteria)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                return objectDb.Query<SystemInfo>();
            }
        }
    }
}