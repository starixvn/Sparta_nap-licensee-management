// -----------------------------------------------------------------------
// <copyright file="DeletingDefaultBetSettingCriteria.cs" company="">
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
    public class DeletingDefaultBetSettingCriteria : CriteriaBase
    {
        public string Licensee { get; set; }

        public int CurrencyID { get; set; }

        public int? AgentID { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public string IP { get; set; }

        public int UserID { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSetting_Del";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Licensee) && CurrencyID > 0;
        }
    }
}
