namespace Fanex.NAP.Licensee.Model.ViewModel.ManageOperator
{
    using System.Collections.Generic;
    using DTO;

    public class OperatorViewModel
    {
        public Operator Operator { get; set; }

        public IEnumerable<string> SiteNameList { get; set; }
    }
}