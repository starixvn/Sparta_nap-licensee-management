// -----------------------------------------------------------------------
// <copyright file="GetSingleDefaultBetSetting.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.Criteria
{
    using System;
    using Fanex.NAP.Framework.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class GetSingleDefaultBetSettingCriteria : CriteriaBase
    {
        public GetSingleDefaultBetSettingCriteria()
        {
            this.Licensee = string.Empty;
            this.CurrencyID = 0;
        }

        public GetSingleDefaultBetSettingCriteria(string licensee, int currencyId, int? agentId)
        {
            this.Licensee = licensee;
            this.CurrencyID = currencyId;
            this.AgentID = agentId;
        }

        public bool HasSetting { get; set; }

        public string AgentName { get; set; }

        public string CurrencyName { get; set; }

        public string Licensee { get; set; }

        public int CurrencyID { get; set; }

        public int? AgentID { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSetting_Sel";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Licensee) && CurrencyID > 0;
        }
    }
}