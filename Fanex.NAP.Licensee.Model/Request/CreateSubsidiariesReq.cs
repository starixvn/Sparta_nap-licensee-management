namespace Fanex.NAP.Licensee.Model.Request
{
    public class CreateSubsidiariesReq
    {
        public int CustomerId { get; set; }

        public string[] Usernames { get; set; }

        public string SourceAgency { get; set; }

        public string SiteName { get; set; }

        public int ExchangeId { get; set; }
    }
}
