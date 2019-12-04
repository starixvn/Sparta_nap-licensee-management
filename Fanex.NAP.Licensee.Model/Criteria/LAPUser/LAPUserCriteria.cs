namespace Fanex.NAP.Licensee.Model.Criteria.LAPUser
{
    using System.Collections.Generic;

    public class LAPUserCriteria
    {
        public string VendorId { get; set; }

        public string UserID { get; set; }

        public string UserPWD { get; set; }

        public string RequestBy { get; set; }

        public int RedmineID { get; set; }

        public int UserLoginId { get; set; }

        public string UserLoginName { get; set; }

        public IEnumerable<FunctionPermissionCriteria> FuncPermissions{ get; set; }

        public string Currency { get; set; }

        public int IsRemoveGroup { get; set; }

    }
}