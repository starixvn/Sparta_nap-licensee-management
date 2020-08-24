namespace Fanex.NAP.Licensee.Model.DTO
{
    public class ProductVolumeControlSetting
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public int ProductPercentage { get; set; }

        public int WLExpected { get; set; }

        public int WLAccumulated { get; set; }

        public int WLRemaining { get; set; }

        public int TOExpected { get; set; }

        public int TOAccumulated { get; set; }

        public int TORemaining { get; set; }
    }
}