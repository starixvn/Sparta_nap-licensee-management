namespace Fanex.NAP.Licensee.Model.ViewModel.LicenseeBetSetting
{
    using DTO;

    public class BSResultViewModel : ResultInfo
    {
        public BSResultViewModel(string sportOrBetTypeName, int code, string message)
        {
            SportOrBetTypeName = sportOrBetTypeName;
            Code = code;
            IsOk = code == 0;
            Message = message;
        }

        public BSResultViewModel()
        {
            Code = 0;
            IsOk = true;
            Message = string.Empty;
        }

        public string SportOrBetTypeName { get; set; }
    }
}
