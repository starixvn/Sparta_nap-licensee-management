using static System.String;

namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    using Data;
    using Data.Repository;

    public class CreateLicenseeSubsidiaryCriteria : CriteriaBase
    {
        public int CustId { get; set; }

        [SpParam(SqlParamName = "creator")]
        public int UserId { get; set; }

        [SpParam(SqlParamName = "Ip")]
        public string UserIp { get; set; }

        public string Username { get; set; }

        public string ExistedUsername { get; set; }

        public int MRecommend { get; set; }

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