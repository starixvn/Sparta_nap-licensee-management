namespace Fanex.NAP.Licensee.Model.DTO.LicenseeBetSetting
{
    public class BSBaseItem
    {
        public int SportTypeId { get; set; }

        public int BetTypeId { get; set; }

        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }

        public decimal MaxPerMatch { get; set; }
    }
}
