using static System.String;

namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    using Data.Repository;

    public class RegisterCustomerCriteria : CriteriaBase
    {
        public string Username { get; set; }

        public int UpLineId { get; set; }

        public int RoleId => 2;

        public string Site { get; set; }

        public int SiteDbGroupId { get; set; }

        public override string GetSettingKey()
        {
            return "API_CustomerIns_Register";
        }

        public override bool IsValid()
        {
            return !IsNullOrWhiteSpace(Username)
                   && !IsNullOrWhiteSpace(Site);
        }
    }
}