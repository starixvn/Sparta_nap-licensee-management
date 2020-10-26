namespace Fanex.NAP.Licensee.Model.DTO
{
    public class ProductVolumeControlSetting
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public decimal ProductPercentage { get; set; }

        public decimal WLExpected { get; set; }

        public decimal WLAccumulated { get; set; }

        public decimal WLRemaining { get; set; }

        public decimal TOExpected { get; set; }

        public decimal TOAccumulated { get; set; }

        public decimal TORemaining { get; set; }
    }
}