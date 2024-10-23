namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    using Data.Repository;

    public class RollbackCreateSubsidiaryCommand : NonQueryCommand
    {
        public int CustId { get; set; }

        public override string GetSettingKey()
        {
            return "Acc_CustomerIns_Rollback";
        }

        public override bool IsValid()
        {
            return CustId > 0;
        }
    }
}