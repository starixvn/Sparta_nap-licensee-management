namespace Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting
{
    using System;
    using Data.Repository;

    [Serializable]
    public class GetAllDefaultBetSettingCriteria : CriteriaBase
    {
        public string Licensee { get; set; }

        public string Currency { get; set; }

        public bool ShowSportsBook { get; set; }

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
                && (ShowSportsBook || ShowNumberGame || ShowVirtualSport || ShowKeno);
        }
    }
}