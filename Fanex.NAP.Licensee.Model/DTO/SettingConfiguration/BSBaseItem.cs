namespace Fanex.NAP.Licensee.Model.DTO.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Bet setting base item.
    /// </summary>
    public class BSBaseItem
    {
        public int SportTypeId { get; set; }

        public int BetTypeId { get; set; }

        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }

        public decimal MaxPerMatch { get; set; }
    }
}
