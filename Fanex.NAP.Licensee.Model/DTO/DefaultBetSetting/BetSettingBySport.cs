namespace Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting
{
    using System;
    using Fanex.NAP.Licensee.Model.DataDomain;
    using Fanex.NAP.Licensee.Model.MetaModel;

    [Serializable]
    public class BetSettingBySport : ISportGameMetaModel
    {
        private SportOrGameItem _sportOrGame;

        public SportOrGameItem SportOrGame
        {
            get { return _sportOrGame; }
            set { _sportOrGame = value; }
        }

        public decimal? MinBet { get; set; }

        public decimal? MaxBet { get; set; }

        public decimal? MaxPerMatch { get; set; }

        public decimal? MaxPerBall { get; set; }

        public decimal? MaxPayoutPerMatch { get; set; }

        public int SportGameTypeId => _sportOrGame.Id;

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
                if (this.SportOrGame != null && this.SportOrGame.Id == StaticSiteValue.NUMBERGAMESPORT)
                {
                    return (!MaxBet.HasValue && !MaxPerBall.HasValue && !MaxPerMatch.HasValue) ||
                       (MaxBet.HasValue && MaxBet.Value > 0 && MaxPerBall.HasValue && MaxPerBall.Value > 0);
                }
                else
                {
                    return (!MaxBet.HasValue && !MaxPerMatch.HasValue) ||
                     (MaxBet.HasValue && MaxBet.Value > 0 && MaxPerMatch.HasValue && MaxPerMatch.Value > 0);
                }
            }
        }
    }
}