// -----------------------------------------------------------------------
// <copyright file="SetingBySport.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.DTO
{
    using System;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class BetSettingBySport
    {
        public SportOrGameItem SportOrGame { get; set; }

        public decimal? MaxBet { get; set; }

        public decimal? MaxPerMatch { get; set; }

        public decimal? MaxPerBall { get; set; }

        public int BetType { get; set; }

        public bool IsValid
        {
            get
            {
                return IsValidDataKey && IsValidDataValue;
            }
        }

        private bool IsValidDataKey
        {
            get
            {
                return BetType > 0 && SportOrGame != null && SportOrGame.Id > 0;
            }
        }

        private bool IsValidDataValue
        {
            get
            {
                return
                    (!MaxBet.HasValue && !MaxPerMatch.HasValue && !MaxPerBall.HasValue) ||
                   (MaxBet.HasValue && MaxBet.Value > 0 && MaxPerMatch.HasValue && MaxPerMatch.Value > 0
                            && ((MaxPerBall.HasValue && MaxPerBall.Value > 0) || !MaxPerBall.HasValue));
            }
        }
    }
}