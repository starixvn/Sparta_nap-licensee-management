namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Bet setting number game row view model.
    /// </summary>
    public class BSNumberGameRowViewModel : BSRowBaseViewModel
    {
        public BSNumberGameRowViewModel()
        {
        }

        public BSNumberGameRowViewModel(
            int sportTypeId,
            string sportTypeName,
            int betTypeId,
            string betTypeName,
            decimal minBet,
            decimal maxBet,
            decimal maxPerMatch,
            decimal maxPerBall)
            : base(sportTypeId, sportTypeName, betTypeId, betTypeName, minBet, maxBet, maxPerMatch, true)
        {
            MaxPerBall = maxPerBall;
        }

        public decimal MaxPerBall { get; set; }
    }
}
