namespace Fanex.NAP.Licensee.Model.Criteria.ITUser
{
    using System.Collections.Generic;

    public class EditFunctionCriteria
    {
        public int UserId { get; set; }

        public IEnumerable<LicenseeFunctionCriteria> NewFunctions { get; set; }

        public IEnumerable<LicenseeFunctionCriteria> RemovedFunctions { get; set; }

        public int RedmineId { get; set; }
    }
}