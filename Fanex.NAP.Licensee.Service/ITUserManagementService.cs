namespace Fanex.NAP.Licensee.Service
{
    using System.Collections.Generic;
    using Core;
    using Model.Criteria.ITUser;
    using Model.DTO;

    public class ITUserManagementService : IITUserManagementService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public ITUserManagementService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public ResultGridData<ITUser> GetUserList(SearchUserCriteria criteria)
        {
            var result = new ResultGridData<ITUser>();

            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_Select"))
            {
                result.Data = db.Query<ITUser>(criteria);
            }

            result.TotalItem = criteria.TotalItem;

            return result;
        }

        public IEnumerable<OptionItem> GetLicenseeUserList(int userId)
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_GetLicensee"))
            {
                return db.Query<OptionItem>(new { UserId = userId });
            }
        }
    }
}