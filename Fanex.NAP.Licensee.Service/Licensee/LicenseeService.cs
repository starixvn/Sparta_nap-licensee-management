// -----------------------------------------------------------------------
// <copyright file="LicenseeService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.Licensee
{
    using System.Collections.Generic;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.Criteria.Licensee;
    using Fanex.NAP.Licensee.Model.DTO.Licensee;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class LicenseeService : ILicenseeService
    {
        public IEnumerable<Licensee> GetDummyLicensees(GetLicenseesCriteria criteria)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                return objectDb.Query<Licensee>();
            }
        }

        public IEnumerable<LicenseeType> GetLicenseeTypes(GetLicenseeTypeCriteria criteria)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                return objectDb.Query<LicenseeType>();
            }
        }

        public string CreateLicensee(CreateLicenseeCriteria criteria)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                objectDb.ExecuteNonQuery(criteria.GetSpParams());
                return objectDb.GetParameterValue("ErrMsg").ToString();
            }
        }
    }
}