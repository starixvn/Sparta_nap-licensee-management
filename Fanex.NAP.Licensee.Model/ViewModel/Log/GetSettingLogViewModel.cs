namespace Fanex.NAP.Licensee.Model.ViewModel.Log
{
    public class GetSettingLogViewModel
    {
        public int LicenseeId { get; set; }

        public int CustId { get; set; }

        public int AgentId { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }
    }
}
