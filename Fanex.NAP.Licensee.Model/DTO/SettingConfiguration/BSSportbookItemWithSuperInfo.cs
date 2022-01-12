namespace Fanex.NAP.Licensee.Model.DTO.SettingConfiguration
{
    using System.Collections.Generic;

   public class BSSportbookItemWithSuperInfo 
    {
        public List<BSSportbookItem> SuperItems { get; set; }

        public List<BSSportbookItem> AgentItems { get; set; }
    }
}
