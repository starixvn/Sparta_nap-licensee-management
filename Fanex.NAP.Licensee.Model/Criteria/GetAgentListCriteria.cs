// -----------------------------------------------------------------------
// <copyright file="GetAgentListCriteria.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.Criteria
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class GetAgentListCriteria : CriteriaBase
    {
        public string Licensee { get; set; }

        public int CurrencyID { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSettingAgent_SelByCurrencyAndLicensee";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Licensee) && CurrencyID > 0;
        }
    }
}
