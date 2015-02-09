// -----------------------------------------------------------------------
// <copyright file="ILicenseeService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.Licensee
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.Criteria.Licensee;
    using Fanex.NAP.Licensee.Model.DTO.Licensee;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface ILicenseeService
    {
        IEnumerable<Licensee> GetDummyLicensees(GetLicenseesCriteria criteria);

        IEnumerable<LicenseeType> GetLicenseeTypes(GetLicenseeTypeCriteria criteria);

        string CreateLicensee(CreateLicenseeCriteria criteria);
    }
}