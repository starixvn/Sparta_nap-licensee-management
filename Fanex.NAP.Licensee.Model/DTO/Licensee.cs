namespace Fanex.NAP.Licensee.Model.DTO
{
    using System;

    public class Licensee
    {
        public int LicenseeID { get; set; }

        public string LicenseeName { get; set; }

        public string Desciption { get; set; }

        public bool IsDeposit { get; set; }

        public DateTime? AffectedDate { get; set; }

        public bool IsActive { get; set; }

        public bool IsKPIActive { get; set; }

        public bool IsOneWorkActive { get; set; }

        public string BrandName { get; set; }

        public string CompanyName { get; set; }

        public bool IsAllowedMemberComm { get; set; }

        public bool EditBetSetting { get; set; }

        public string AffectedDateString => AffectedDate?.ToString("MM/dd/yyyy");
    }
}