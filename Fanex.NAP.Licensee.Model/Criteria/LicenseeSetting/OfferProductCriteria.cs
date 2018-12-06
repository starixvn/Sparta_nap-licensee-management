namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    using System;

    public class OfferProductCriteria : LicenseeProductCriteria
    {
        public DateTime? EffectiveDate { get; set; }

        public string RedMineId { get; set; }

        public dynamic SpParam => new
        {
            LicenseeName = LicenseeName,
            ProductCode = ProductCode,
            EffectiveDate = EffectiveDate
        };
    }
}