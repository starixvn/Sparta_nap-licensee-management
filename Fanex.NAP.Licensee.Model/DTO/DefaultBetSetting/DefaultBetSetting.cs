namespace Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting
{
    public class DefaultBetSetting
    {
        public string Licensee { get; set; }

        public int? CurrencyID { get; set; }

        public string Currency { get; set; }

        public int? AgentID { get; set; }

        public string AgentName { get; set; }

        public int SportType { get; set; }

        public string SportName { get; set; }

        public string SportGameType { get; set; }

        public decimal? MaxBet { get; set; }

        public decimal? MaxPerMatch { get; set; }

        public decimal? MaxPerBall { get; set; }
    }
}