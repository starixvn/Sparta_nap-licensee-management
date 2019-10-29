namespace Fanex.NAP.Licensee.Model.Criteria.Vendor
{
    public class LAPUserCriteria
    {
        public string SiteName { get; set; }

        public string UserID { get; set; }

        public string UserPWD { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public bool isEnabled { get; set; }

        public bool isAdmin { get; set; }

        public string RequestBy { get; set; }

        public string RedmineID { get; set; }
    }
}
