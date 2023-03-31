namespace Fanex.NAP.Licensee.Model.DTO
{
    using Fanex.Data;

    public class SuperLicenseeAndCurrencyItem
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int CurrencyId { get; set; }

        public string CurrencyName { get; set; }

        [SpParam(Ignored = true)]
        public string CurrencyWithSuper => $"{CurrencyName} ({Name})";
    }
}
