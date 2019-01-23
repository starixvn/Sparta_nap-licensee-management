namespace Fanex.NAP.Licensee.Model.Criteria.LrfFunction
{
    public class AssignLrfFunctionCriteria
    {
        public int FunctionId { get; set; }

        public string AssignedLicensees { get; set; }

        public string UnassignedLicensees { get; set; }

        public int AssignOption { get; set; }

        public int RemoveOption { get; set; }

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            FunctionId = FunctionId,
            AssignedLicensees = AssignedLicensees,
            UnassignedLicensees = UnassignedLicensees,
            AssignOption = AssignOption,
            RemoveOption = RemoveOption
        };
    }
}