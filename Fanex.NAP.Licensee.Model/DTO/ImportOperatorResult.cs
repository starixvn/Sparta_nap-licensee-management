namespace Fanex.NAP.Licensee.Model.DTO
{
    public class ImportOperatorResult : Operator
    {
        public string Action { get; set; }

        public string Status => Action == "Add" ? "Added" : (Action == "Update" ? "Updated" : Action);

        public string Error { get; set; }
    }
}
