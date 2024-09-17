namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    using Data.Repository;

    public class GetShardDbConfigCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public override string GetSettingKey()
        {
            return "Acc_Dep_ServerDBConfigSelByCust";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Username);
        }
    }
}