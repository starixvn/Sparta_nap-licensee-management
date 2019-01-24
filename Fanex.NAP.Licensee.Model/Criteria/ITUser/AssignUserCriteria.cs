namespace Fanex.NAP.Licensee.Model.Criteria.ITUser
{
    public class AssignUserCriteria
    {
        public int UserId { get; set; }

        public string AssignedLicensees { get; set; }

        public string UnassignedLicensees { get; set; }

        public int AssignOption { get; set; }

        public int RemoveOption { get; set; }

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            UserId = UserId,
            AssignedLicensees = AssignedLicensees,
            UnassignedLicensees = UnassignedLicensees,
            AssignOption = AssignOption,
            RemoveOption = RemoveOption
        };
    }
}