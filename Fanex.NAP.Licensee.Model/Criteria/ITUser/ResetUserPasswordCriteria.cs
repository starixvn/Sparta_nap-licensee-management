namespace Fanex.NAP.Licensee.Model.Criteria.ITUser
{
    public class ResetUserPasswordCriteria
    {
        public int UserId { get; set; }

        public string Password { get; set; }

        public string Token { get; set; }

        public int RedmineId { get; set; }

        public dynamic SpParam => new
        {
            UserId = UserId,
            UserPwd = Password,
            UserSalt = Token
        };
    }
}
