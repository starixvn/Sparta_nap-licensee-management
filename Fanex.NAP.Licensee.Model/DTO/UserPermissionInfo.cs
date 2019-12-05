namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class UserPermissionInfo
    {
        public UserGroup UserGroup { get; set; }

        public IEnumerable<UserFuncPermission> FuncPermission { get; set; }
    }
}
