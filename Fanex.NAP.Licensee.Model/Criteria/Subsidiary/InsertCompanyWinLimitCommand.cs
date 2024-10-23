namespace Fanex.NAP.Licensee.Model.Criteria.Subsidiary
{
    using Data.Repository;

    public class InsertCompanyWinLimitCommand : NonQueryCommand
    {
        public InsertCompanyWinLimitCommand(int licenseeId)
        {
            LicenseeId = licenseeId;
        }

        public int LicenseeId { get; set; }

        public override string GetSettingKey()
        {
            return "Dot_Dep_CWL_InsertSetting";
        }

        public override bool IsValid()
        {
            return LicenseeId > 0;
        }
    }
}