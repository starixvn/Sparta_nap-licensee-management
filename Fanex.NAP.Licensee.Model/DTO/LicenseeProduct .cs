namespace Fanex.NAP.Licensee.Model.DTO
{
    using System;

    public class LicenseeProduct : Product
    {
        public string PullServiceKey { get; set; }

        public bool EnablePullService { get; set; }

        public bool Comm { get; set; }

        public bool WinLoss { get; set; }

        public DateTime? EffectiveDate { get; set; }

        public string EffectiveDateString => EffectiveDate?.ToString("MM/dd/yyyy");
    }
}