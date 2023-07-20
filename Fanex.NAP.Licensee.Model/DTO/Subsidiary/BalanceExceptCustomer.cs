namespace Fanex.NAP.Licensee.Model.DTO.Subsidiary
{
    public class BalanceExceptCustomer
    {
        public BalanceExceptCustomer(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
