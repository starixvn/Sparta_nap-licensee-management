namespace Fanex.NAP.Licensee.Model.Criteria.ITUser
{
    public class EditUserCriteria
    {
        public int UserId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public bool IsActive { get; set; }

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            UserId = UserId,
            FirstName = FirstName ?? string.Empty,
            LastName = LastName ?? string.Empty,
            IsActive = IsActive ? 1 : 0
        };
    }
}
