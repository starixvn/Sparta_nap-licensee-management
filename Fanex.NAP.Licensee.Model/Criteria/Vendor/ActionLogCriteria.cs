namespace Fanex.NAP.Licensee.Model.Criteria.Vendor
{
    using Fanex.Data.Repository;

    public class ActionLogCriteria : CriteriaBase
    {
        public int CustId { get; set; }

        public string Doing { get; set; }

        public int UserId { get; set; }

        public byte TypeId { get; set; }

        public int ActionId { get; set; }

        public int Duration { get; set; }

        public override bool IsValid() => CustId > 0;

        public override string GetSettingKey() => "WriteLog_UserLog_UserControl";
    }
}