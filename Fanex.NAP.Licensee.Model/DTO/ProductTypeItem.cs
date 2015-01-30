namespace Fanex.NAP.Licensee.Model.DTO
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class ProductTypeItem
    {
        public ProductTypeItem(int id, string name, IList<string> lstFunctions)
        {
            Id = id;
            Name = name;
            Functions = lstFunctions;
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public IList<string> Functions { get; set; }
    }
}
