namespace Fanex.NAP.Licensee.Model.Criteria.ITUser
{
    using System.Collections.Generic;

    public class EditFunctionCriteria
    {
        public string UserName { get; set; }

        public IEnumerable<LicenseeFunctionCriteria> NewFunctions { get; set; }

        public IEnumerable<LicenseeFunctionCriteria> RemoveFunctions { get; set; }

        public int RedmineId { get; set; }
    }
}