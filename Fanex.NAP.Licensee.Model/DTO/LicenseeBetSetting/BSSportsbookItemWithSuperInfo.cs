namespace Fanex.NAP.Licensee.Model.DTO.LicenseeBetSetting
{
    using System.Collections.Generic;

    public class BSSportsbookItemWithSuperInfo 
    {
        public List<BSSportsbookItem> SuperItems { get; set; }

        public List<BSSportsbookItem> AgentItems { get; set; }
    }
}
