namespace Fanex.NAP.Licensee.Model.ViewModel.ManageOperator
{
    using System.Linq;
    using DTO;

    public class OperatorViewModel
    {
        public OperatorViewModel()
        {
            ViewData = new SearchOperatorViewModel
            {
                SiteNameList = Enumerable.Empty<string>(),
                CurrencyList = Enumerable.Empty<CurrencyItem>()
            };
            Operator = new Operator();
        }

        public SearchOperatorViewModel ViewData { get; set; }

        public Operator Operator { get; set; }
    }
}