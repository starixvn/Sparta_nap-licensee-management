namespace Fanex.NAP.Licensee.Model.DTO.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Bet setting item.
    /// </summary>
    public class BetSettingItem
    {
        public int MinBet { get; set; }

        public int MaxBet { get; set; }

        public int MaxPerMatch { get; set; }
    }
}
