namespace Fanex.NAP.Licensee.Model.Criteria.ITUser
{
    public class SearchUserCriteria : PageModel
    {
        public string UserName { get; set; }

        public bool IsClosed { get; set; }
    }
}