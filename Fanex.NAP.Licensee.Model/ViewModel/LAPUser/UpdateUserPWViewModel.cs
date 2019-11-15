namespace Fanex.NAP.Licensee.Model.ViewModel.LAPUser
{
    using DTO;

    public class UpdateUserPWViewModel
    {
        public LAPUser UserInfo { get; set; }

        public double TimeRemaining { get; set; }

        public bool IsValid { get; set; }

        public string FuntionPermissions { get; set; }

        public UserPermissionInfo OldFuncPermissions { get; set; }
    }
}