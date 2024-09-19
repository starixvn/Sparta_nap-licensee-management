namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    using Data.Repository;
    using Microsoft.Ajax.Utilities;

    public class CheckExistedAccountCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public int RoleId { get; set; } = 2;

        public override string GetSettingKey()
        {
            return "Acc_Dep_CheckExistedAccount";
        }

        public override bool IsValid()
        {
            return !Username.IsNullOrWhiteSpace();
        }
    }
}