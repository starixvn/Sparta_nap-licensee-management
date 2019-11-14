using System.Collections.Generic;

namespace Fanex.NAP.Licensee.Model.Criteria.LAPUser
{
    public class FunctionPermissionCriteria
    {
        public int UserSEQ { get; set; }

        public string FunctionKey { get; set; }

        public string SiteName { get; set; }

        public int? SystemType { get; set; }

        public string SubFunctionKeys { get; set; }

        public bool IsAllow { get; set; }
    }
}
