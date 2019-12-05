namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class UserGroup
    {
        public int GroupId { get; set; }

        public string GroupName { get; set; }

        public IEnumerable<UserFuncPermission> FuncPermission { get; set; }
    }
}
