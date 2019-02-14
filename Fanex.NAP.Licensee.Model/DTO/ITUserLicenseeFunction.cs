namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class ITUserLicenseeFunction
    {
        public ITUserLicensee Licensee { get; set; }

        public IEnumerable<ITUserFunctionHierarchy> Functions { get; set; }
    }
}