namespace Fanex.NAP.Licensee.Model.Criteria.ITUser
{
    public class AddUserCriteria
    {
        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public bool IsAdmin { get; set; }

        public string LicenseeName { get; set; }

        public int Option { get; set; }

        public bool IsOpen { get; set; }

        public string Password { get; set; }

        public string Token { get; set; }

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            UserName = UserName,
            FirstName = FirstName,
            LastName = LastName,
            Email = Email,
            IsAdmin = IsAdmin ? 1 : 0,
            LicenseeName = LicenseeName,
            IsOpen = IsOpen ? 1 : 0,
            UserSalt = Token,
            UserPwd = Password,
            Option = Option,
            UserId = 0
        };
    }
}
