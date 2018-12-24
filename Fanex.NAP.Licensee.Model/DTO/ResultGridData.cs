namespace Fanex.NAP.Licensee.Model.DTO
{
    using System.Collections.Generic;

    public class ResultGridData<T> where T : class
    {
        public IEnumerable<T> Data { get; set; }

        public int TotalItem { get; set; }
    }
}