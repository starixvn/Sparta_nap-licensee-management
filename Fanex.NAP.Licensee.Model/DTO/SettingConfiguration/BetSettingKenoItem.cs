namespace Fanex.NAP.Licensee.Model.DTO.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Bet setting keno item.
    /// </summary>
    public class BetSettingKenoItem
    {
        public int IBCBetTypeID { get; set; }

        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }

        public decimal MaxPerGameType { get; set; }

        public bool IsDisabled { get; set; }

        public bool DisableDowlinesKeno { get; set; }
    }
}
