namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeBetSetting
{
    using Fanex.Data.Repository;
    using System;

    public class GetSettingLogCriteria : CriteriaBase
    {
        public int CustId { get; set; }

        public int AgentId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int ActionTypeId { get; set; }

        public bool IsInternal { get; set; }

        public int LowerActionId { get; set; }

        public int UpperActionId { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public override string GetSettingKey() => "NAP_LM_LicenseeUserLog_RunSPSel";

        public override bool IsValid() => AgentId >= 0 && CustId > 0 && IsValidDate();

        private bool IsValidDate() => FromDate <= ToDate && FromDate > DateTime.MinValue;
    }
}
