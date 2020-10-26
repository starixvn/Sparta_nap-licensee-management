namespace Fanex.NAP.Licensee.Model.DTO
{
    public class ResultData<T>
    {
        public bool IsSuccess { get; set; }

        public T Data { get; set; }

        public string Error { get; set; }
    }
}