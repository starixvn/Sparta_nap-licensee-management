namespace Fanex.NAP.Licensee.Model.DTO
{
    public class BetTicket
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public int Percent { get; set; }

        public int ExpectedWL { get; set; }

        public int AccumulatedWL { get; set; }

        public int RemainingWL { get; set; }

        public int ExpectedTurnover { get; set; }

        public int AccumulatedTurnover { get; set; }

        public int RemainingTurnover { get; set; }
    }
}