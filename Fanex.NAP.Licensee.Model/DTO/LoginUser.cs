namespace Fanex.NAP.Licensee.Model.DTO
{
    /// <summary>
    /// LoginUser class.
    /// </summary>
    public class LoginUser
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public string LoginToken { get; set; }

        public string SessionId { get; set; }

        public string Environment { get; set; }

        public int SiteId { get; set; }
    }
}