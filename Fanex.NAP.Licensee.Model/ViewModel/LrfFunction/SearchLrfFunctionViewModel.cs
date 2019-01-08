namespace Fanex.NAP.Licensee.Model.ViewModel.LrfFunction
{
    using System.Collections.Generic;
    using DTO;

    public class SearchLrfFunctionViewModel
    {
        public IEnumerable<OptionItem> GroupFunctionList { get; set; }

        public IDictionary<int, string> TypeList { get; set; }

        public IEnumerable<string> EnvironmentList { get; set; }
    }
}