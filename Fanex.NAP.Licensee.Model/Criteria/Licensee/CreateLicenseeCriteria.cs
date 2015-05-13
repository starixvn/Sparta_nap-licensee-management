// -----------------------------------------------------------------------
// <copyright file="CreateLicenseeCriteria.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.Criteria.Licensee
{
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class CreateLicenseeCriteria : CriteriaBase
    {
        public string LicenseeName { get; set; }

        public int LicenseeTypeId { get; set; }

        public string ProductCode { get; set; }

        public string SpecialFunc { get; set; }

        public string ErrMsg { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_LM_CreateNewLicensee";
        }
    }
}