namespace Fanex.NAP.Licensee.Model.ViewModel.LrfFunction
{
    using System.Collections.Generic;
    using DTO;

    public class LrfFunctionViewModel
    {
        public LrfFunction Function { get; set; }

        public IList<OptionItem> ParentFunctionList { get; set; }
    }
}