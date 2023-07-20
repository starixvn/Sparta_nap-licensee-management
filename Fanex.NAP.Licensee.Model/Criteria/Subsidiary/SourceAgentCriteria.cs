using Fanex.Data;
using Fanex.Data.Repository;

namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    public class SourceAgentCriteria : CriteriaBase
    {
        [SpParam(SqlParamName = "SRecommend")]
        public int Id { get; set; }

        [SpParam(SqlParamName = "UsernameAgent")]
        public string Username { get; set; } = "";

        public override string GetSettingKey()
        {
            return "NAP_LM_LicenseeSelSourceAgent";
        }

        public override bool IsValid()
        {
            return Id > 0;
        }
    }
}
