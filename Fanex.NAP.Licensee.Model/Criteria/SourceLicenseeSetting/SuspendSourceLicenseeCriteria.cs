namespace Fanex.NAP.Licensee.Model.Criteria.SourceLicenseeSetting
{
    using System;

    public class SuspendSourceLicenseeCriteria
    {
        public DateTime StopFrom { get; set; }

        public DateTime EndDate => StopFrom.AddDays(-1);

        public bool Restart { get; set; }

        public DateTime RestartFrom { get; set; }

        public DateTime RestartTo { get; set; }

        public string SettingIdList { get; set; }

        public string RedmineId { get; set; }

        public dynamic SpParam => new
        {
            EndDate = EndDate,
            Restart = Restart,
            RestartFrom = RestartFrom,
            RestartTo = RestartTo,
            SettingIdList = SettingIdList
        };
    }
}