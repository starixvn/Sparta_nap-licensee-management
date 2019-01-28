namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class ITUserLicenseeFunction
    {
        public OptionItem Licensee { get; set; }

        public IEnumerable<ITUserFunctionHierarchy> Functions { get; set; }
    }
}