// -----------------------------------------------------------------------
// <copyright file="GetSystemInfoCriteria.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.Criteria.Core
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class GetSystemInfoCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "NAP_LM_SystemSel";
        }
    }
}