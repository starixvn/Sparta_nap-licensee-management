// -----------------------------------------------------------------------
// <copyright file="DefaultBetSettingCriteria.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.Criteria
{
    using Fanex.Data.Repository;
    using System;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class DefaultBetSettingCriteria : CriteriaBase
    {
        public string Licensee { get; set; }

        public string Currency { get; set; }

        public bool ShowSportBook { get; set; }

        public bool ShowNumberGame { get; set; }

        public bool ShowVirtualSport { get; set; }

        public bool ShowKeno { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSetting_List";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Licensee) && !string.IsNullOrEmpty(Currency)
                && (ShowSportBook || ShowNumberGame || ShowVirtualSport || ShowKeno);
        }
    }
}