namespace Fanex.NAP.Licensee.Model.Criteria.Operator
{
    public class SearchOperatorCriteria : PageModel
    {
        public string SiteName { get; set; }

        public int CurrencyId { get; set; }

        public string OperatorId { get; set; }

        public int AgentId { get; set; }

        public bool IsEmptyOperatorId { get; set; }
    }
}