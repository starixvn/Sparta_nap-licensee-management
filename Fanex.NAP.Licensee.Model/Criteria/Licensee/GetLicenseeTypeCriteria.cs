// -----------------------------------------------------------------------
// <copyright file="GetLicenseeTypeCriteria.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.Criteria.Licensee
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class GetLicenseeTypeCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "NAP_LM_LicenseeTypeSel";
        }
    }
}