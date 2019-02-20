namespace Fanex.NAP.Licensee.Model.DTO
{
    public class ITUserFunction
    {
        public int UserId { get; set; }

        public int LicenseeId { get; set; }

        public string LicenseeName { get; set; }

        public int FunctionId { get; set; }

        public string FunctionName { get; set; }

        public int UserFunctionId { get; set; }

        public bool IsActive { get; set; }
    }
}