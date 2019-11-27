using System.Collections.Generic;

namespace Fanex.NAP.Licensee.Model.DTO
{
    public class LAPUser
    {
        public int UserSEQ { get; set; }

        public string SiteName { get; set; }

        public string UserID  { get; set; }

        public string UserPWD { get; set; }

        public string Currency { get; set; }

        public UserPermissionInfo UserPermission { get; set; }
    }
}