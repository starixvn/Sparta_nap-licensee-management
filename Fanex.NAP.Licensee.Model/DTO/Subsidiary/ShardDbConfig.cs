namespace Fanex.NAP.Licensee.Model.DTO.Subsidiary
{
    public class ShardDbConfig
    {
        public int CustId { get; set; }

        public string Site { get; set; }

        public int SiteDbGroupId { get; set; }

        public int CustDbGroupId { get; set; }

        public string SiteDbServer { get; set; }

        public string CustDbServer { get; set; }
    }
}