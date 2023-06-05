namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;
    using System.Linq;

    public class PagedList<T> : ResultGridData<T> where T : class
    {
        public PagedList()
        {
            this.TotalItem = 0;
            this.Data = Enumerable.Empty<T>();
        }

        public PagedList(IEnumerable<T> data, int total)
        {
            this.TotalItem = total;
            this.Data = data;
        }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }
    }
}
