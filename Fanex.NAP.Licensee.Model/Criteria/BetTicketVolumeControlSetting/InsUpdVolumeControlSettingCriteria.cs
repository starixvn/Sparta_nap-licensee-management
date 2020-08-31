namespace Fanex.NAP.Licensee.Model.Criteria.BetTicketVolumeControlSetting
{
    using System;

    public class InsUpdateVolumeControlSettingCriteria
    {
        public string BrandCode { get; set; }

        public int UserID { get; set; }

        public DateTime MonthDate { get; set; }

        public string ProductSetting { get; set; }

        public int BaseCurrencyID { get; set; }

        public int ErrorCode { get; set; }

        public string ErrorMessage { get; set; }
    }
}