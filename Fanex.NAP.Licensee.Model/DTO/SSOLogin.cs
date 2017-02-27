using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Fanex.NAP.Licensee.Model.DTO
{
    public class SSOLogin
    {
        public string UserId { get; set; }

        public string OnUserId { get; set; }

        public string Time { get; set; }

        public string RedirectUrl { get; set; }

        public int SiteId { get; set; }

        public string Environment { get; set; }

        public string SessionId { get; set; }
    }
}
