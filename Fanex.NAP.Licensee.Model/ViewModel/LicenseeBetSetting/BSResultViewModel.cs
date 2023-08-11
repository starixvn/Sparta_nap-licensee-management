namespace Fanex.NAP.Licensee.Model.ViewModel.LicenseeBetSetting
{
    public class BSResultViewModel
    {
        public BSResultViewModel(string sportOrBetTypeName, int code, bool isOk, string message)
        {
            SportOrBetTypeName = sportOrBetTypeName;
            Code = code;
            IsOk = isOk;
            Message = message;
        }

        public BSResultViewModel()
        {
            Code = 0;
            IsOk = true;
            Message = string.Empty;
        }

        public string SportOrBetTypeName { get; set; }

        public int Code { get; set; }

        public bool IsOk { get; set; }

        public string Message { get; set; }
    }
}
