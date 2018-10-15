namespace Fanex.NAP.Licensee.Model.DTO
{
    public class Agent
    {
        private string _sitename;

        public string SiteName
        {
            get
            {
                return _sitename;
            }
            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _sitename = value.Trim();
                }
            }
        }

        public int AgentId { get; set; }

        public string CurrencyName { get; set; }

        public int CurrencyId { get; set; }

        public string UserName { get; set; }
    }
}
