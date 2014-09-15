using Fanex.NAP.Framework.Data;

namespace Fanex.NAP.Licensee.Model.Criteria
{
    public class InsertOrUpdateDefaultBetSetting : CriteriaBase
    {
        public string Licensee { get; set; }

        public int CurrencyID { get; set; }

        public int? AgentID { get; set; }

        public string Settings { get; set; }

        public int ErrCode { get; set; }

        public string ErrMsg { get; set; }

        public string IP { get; set; }

        public int UserID { get; set; }

        public override string GetSettingKey()
        {
            return "NAP_SpecialCustSetting_Modify";
        }

        public override bool IsValid()
        {
            return !string.IsNullOrEmpty(Licensee) && CurrencyID > 0 && !string.IsNullOrEmpty(Settings);
        }
    }
}