namespace Fanex.NAP.Licensee.Model.ViewModel.LAPUser
{
    using System.Collections.Generic;
    using DTO;

    public class UpdateUserViewModel
    {
        public LAPUser UserInfo { get; set; }

        public double TimeRemaining { get; set; }

        public bool IsValid { get; set; }

        public string FuntionPermission { get; set; }

        public IEnumerable<CurrencyItem> Currency { get; set; }
    }
}