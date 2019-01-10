namespace Fanex.NAP.Licensee.Model.Criteria.LrfFunction
{
    public class LrfFunctionCriteria
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

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            FunctionId = FunctionId,
            Name = Name,
            Description = Description ?? string.Empty,
            ParentId = ParentId,
            Url = Url ?? string.Empty,
            IsMenu = IsMenu,
            IsActive = IsActive,
            DisplayOrder = DisplayOrder,
            IsNew = IsNew,
            FunctionKey = FunctionKey,
            Environment = Environment,
            IsFunction = IsFunction
        };
    }
}