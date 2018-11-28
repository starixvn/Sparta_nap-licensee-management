namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    using System;

    public class OfferProductCriteria : LicenseeProductCriteria
    {
        public bool IsPullService { get; set; }

        public DateTime? EffectiveDate { get; set; }
    }
}