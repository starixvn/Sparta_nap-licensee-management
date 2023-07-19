using Fanex.Data;
using Fanex.Data.Repository;
using static System.String;

namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    public class CreateLicenseeSubsidiaryCriteria : CriteriaBase
    {
        [SpParam(SqlParamName = "creator")]
        public int UserId { get; set; }

        [SpParam(SqlParamName = "Ip")]
        public string UserIp { get; set; }

        public string Username { get; set; }

        public string ExistedUsername { get; set; }

        public override string GetSettingKey()
        {
            return "Acc_Dep_CustomerInsLicenseeSubsidiary";
        }

        public override bool IsValid()
        {
            return UserId > 0
                && !IsNullOrWhiteSpace(UserIp)
                && !IsNullOrWhiteSpace(Username)
                && !IsNullOrWhiteSpace(ExistedUsername);
        }
    }
}
