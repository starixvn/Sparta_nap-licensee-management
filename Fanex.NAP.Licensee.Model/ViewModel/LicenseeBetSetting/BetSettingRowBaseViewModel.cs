namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Bet setting row base view model.
    /// </summary>
    public class BetSettingRowBaseViewModel
    {
        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }

        public decimal MaxPerMatch { get; set; }
    }
}
