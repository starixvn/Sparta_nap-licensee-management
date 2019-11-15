namespace Fanex.NAP.Licensee.Model.DTO
{
    public class UserFuncPermission
    {
        public int UserSEQ { get; set; }

        public string FunctionKey { get; set; }

        public string SiteName { get; set; }

        public int? SystemType { get; set; }

        public string SubFunctionKeys { get; set; }

        public bool IsAllow { get; set; }
    }
}
