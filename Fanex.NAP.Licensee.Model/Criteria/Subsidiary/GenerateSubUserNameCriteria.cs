using Fanex.Data;
using Fanex.Data.Repository;
using static System.String;

namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    public class GenerateSubUserNameCriteria : CriteriaBase
    {
        private const int Minimum = 0;
        private const int Maximum = 500;

        public string Username { get; set; }

        [SpParam(SqlParamName = "Num")]
        public int Quantity { get; set; }

        public override string GetSettingKey()
        {
            return "Acc_Dep_CustomerGenLicenseeSubUsername";
        }

        public override bool IsValid()
        {
            return Quantity > Minimum && Quantity <= Maximum && !IsNullOrWhiteSpace(Username);
        }
    }
}
