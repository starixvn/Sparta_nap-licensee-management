// -----------------------------------------------------------------------
// <copyright file="GetLicenseesCriteria.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.Criteria.Licensee
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// Get Licensees Criteria.
    /// </summary>
    [Serializable]
    public class GetLicenseesCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "NAP_LM_LicenseeSel";
        }
    }
}