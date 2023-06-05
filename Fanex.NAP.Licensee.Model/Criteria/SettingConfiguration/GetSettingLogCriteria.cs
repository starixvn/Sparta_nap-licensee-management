namespace Fanex.NAP.Licensee.Model.Criteria.SettingConfiguration
{
    using System;
    using Fanex.Data.Repository;

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

        public override string GetSettingKey()
        {
            return "NAP_LM_LicenseeUserLog_RunSPSel";
        }

        public override bool IsValid()
        {
            return CustId > 0
                   && AgentId >= 0 
                   && FromDate <= ToDate 
                   && FromDate > DateTime.MinValue 
                   && ToDate > DateTime.MinValue;
        }
    }
}
