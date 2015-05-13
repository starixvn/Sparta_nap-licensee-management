// -----------------------------------------------------------------------
// <copyright file="GetSpecialFunctionCriteria.cs" company="">
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
    public class GetSpecialFunctionCriteria : CriteriaBase
    {
        public override string GetSettingKey()
        {
            return "NAP_LM_SpecialFunctionSel";
        }
    }
}