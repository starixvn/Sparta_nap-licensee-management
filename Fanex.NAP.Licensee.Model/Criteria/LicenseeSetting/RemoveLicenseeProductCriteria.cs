namespace Fanex.NAP.Licensee.Model.Criteria.LicenseeSetting
{
    public class RemoveLicenseeProductCriteria : LicenseeProductCriteria
    {
        public bool IsRemovePullService { get; set; }

        public dynamic SpParam => new
        {
            LicenseeNameList = LicenseeName,
            ProductCode = ProductCode,
            IsRemovePullService = IsRemovePullService ? 1 : 0
        };
    }
}