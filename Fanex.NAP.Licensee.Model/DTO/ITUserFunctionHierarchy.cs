namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class ITUserFunctionHierarchy : ITUserFunction
    {
        public int? ParentId { get; set; }

        public IEnumerable<ITUserFunction> Children { get; set; }
    }
}