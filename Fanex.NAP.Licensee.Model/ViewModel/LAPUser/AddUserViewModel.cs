using System.Collections.Generic;
using Fanex.NAP.Licensee.Model.DTO;

namespace Fanex.NAP.Licensee.Model.ViewModel.LAPUser
{
    public class AddUserViewModel
    {
        public string SiteName { get; set; }

        public string UserID { get; set; }

        public bool IsValid { get; set; }

        public bool IsExist { get; set; }

        public string Exclusions { get; set; }

        public string FuntionPermission { get; set; }

        public IEnumerable<CurrencyItem> Currency { get; set; }
    }
}