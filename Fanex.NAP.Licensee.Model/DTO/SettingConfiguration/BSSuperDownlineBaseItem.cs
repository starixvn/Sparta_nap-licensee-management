namespace Fanex.NAP.Licensee.Model.DTO.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Bet setting base item.
    /// </summary>
    public class BSSuperDownlineBaseItem : BSBaseItem
    {
        public bool DisableSuper { get; set; }

        public bool DisableDownline { get; set; }
    }
}
