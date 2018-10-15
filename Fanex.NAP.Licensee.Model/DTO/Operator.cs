namespace Fanex.NAP.Licensee.Model.DTO
{
    public class Operator : Agent
    {
        private string _operatorId;

        public string OperatorId
        {
            get
            {
                return _operatorId;
            }

            set
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _operatorId = value.Trim();
                }
            }
        }

        public bool IsValid => AgentId > 0 && !string.IsNullOrWhiteSpace(UserName) && !string.IsNullOrWhiteSpace(SiteName);
    }
}