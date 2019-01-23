namespace Fanex.NAP.Licensee.Model.DTO
{
    using System;

    public class ITUser
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public string UserRole { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Status { get; set; }

        public string Creator { get; set; }

        public DateTime? CreateDate { get; set; }

        public string CreateDateString => CreateDate?.ToString("MM/dd/yyyy");

        public string LicenseeName { get; set; }

        public bool IsInternal { get; set; }
    }
}