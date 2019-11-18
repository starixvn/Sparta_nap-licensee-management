namespace Fanex.NAP.Licensee.Model.Criteria.LAPUser
{
    using System.Collections.Generic;

    public class LAPUserCriteria
    {
        public string SiteName { get; set; }

        public string UserID { get; set; }

        public string UserPWD { get; set; }

        public string RequestBy { get; set; }

        public int RedmineID { get; set; }

        public int UserLoginId { get; set; }

        public string UserLoginName { get; set; }

        public IEnumerable<FunctionPermissionCriteria> FuncPermissionsRemoved { get; set; }

        public IEnumerable<FunctionPermissionCriteria> FuncPermissionsAdded { get; set; }

        public int OldUserGroupSEQ { get; set; }
    }
}