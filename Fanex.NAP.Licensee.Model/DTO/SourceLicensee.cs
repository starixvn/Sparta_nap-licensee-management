namespace Fanex.NAP.Licensee.Model.DTO
{
    using System;
    using DataDomain;

    public class SourceLicensee
    {
        public int Id { get; set; }

        public string SiteName { get; set; }

        public int SourceId { get; set; }

        public int CurrencyID { get; set; }

        public string CurrencyName { get; set; }

        public int Roleid { get; set; }

        public string SourceSiteName { get; set; }

        public DateTime? EffectiveDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsActive { get; set; }

        public string EffectiveDateString => EffectiveDate?.ToString("MM/dd/yyyy");

        public string EndDateString => EndDate?.ToString("MM/dd/yyyy");

        public string Role => ((RoleType)Roleid).ToString();
    }
}