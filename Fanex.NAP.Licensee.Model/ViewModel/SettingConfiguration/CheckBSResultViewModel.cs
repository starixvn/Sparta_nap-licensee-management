namespace Fanex.NAP.Licensee.Model.ViewModel.SettingConfiguration
{
    public class CheckBSResultViewModel : BSResultViewModel
    {
        public CheckBSResultViewModel(string sportOrBetTypeName, bool isOk, string message, int code) : base(sportOrBetTypeName, isOk, message)
        {
            Code = code;
        }

        public int Code { get; set; }
    }
}
