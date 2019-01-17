namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class LrfFunctionHierarchy : LrfFunction
    {
        public bool Root { get; set; }

        public IEnumerable<LrfFunctionHierarchy> Children { get; set; }
    }
}