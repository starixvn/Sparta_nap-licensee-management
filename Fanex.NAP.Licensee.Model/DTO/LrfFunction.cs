namespace Fanex.NAP.Licensee.Model.DTO
{
    public class LrfFunction
    {
        public int FunctionId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int ParentId { get; set; }

        public string Url { get; set; }

        public bool IsMenu { get; set; }

        public bool IsActive { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsNew { get; set; }

        public string FunctionKey { get; set; }

        public string Environment { get; set; }

        public bool IsFunction { get; set; }
    }
}