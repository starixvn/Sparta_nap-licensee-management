namespace Fanex.NAP.Licensee.Model.DTO.Subsidiary
{
    public class SubsidiaryAccount
    {
        public string Username { get; set; }

        public int ExistedCustomerId { get; set; }

        public int CustomerId { get; set; }

        public BalanceCustomerList BalanceCustomerList { get; set; }
    }
}
