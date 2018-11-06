// -----------------------------------------------------------------------
// <copyright file="ResultInfo.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.DTO
{
    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class ResultData<T> where T : class
    {
        public bool IsSuccess { get; set; }

        public T Data { get; set; }
    }
}