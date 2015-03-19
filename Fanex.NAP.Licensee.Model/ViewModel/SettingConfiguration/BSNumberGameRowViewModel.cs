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
            string minBet,
            string maxBet,
            string maxPerMatch,
            string maxPerBall)
            : base(sportTypeId, sportTypeName, betTypeId, betTypeName, minBet, maxBet, maxPerMatch, false)
        {
            MaxPerBall = maxPerBall;
        }

        public string MaxPerBall { get; set; }
    }
}
