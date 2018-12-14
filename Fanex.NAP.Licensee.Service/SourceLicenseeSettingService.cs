namespace Fanex.NAP.Licensee.Service
{
    using Core;
    using Model.Criteria.SourceLicenseeSetting;
    using Model.DTO;

    public class SourceLicenseeSettingService : ISourceLicenseeSettingService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;
        private readonly ILogWriterService _logWriter;

        public SourceLicenseeSettingService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
            _logWriter = new LogWriterService();
        }

        public ResultGridData<SourceLicensee> Search(SearchSourceLicenseeCriteria criteria, string sp = "Nap_LM_SourceLicensee_Select")
        {
            var result = new ResultGridData<SourceLicensee>();

            using (var db = _objectDbGenerator.Create(sp))
            {
                result.Data = db.Query<SourceLicensee>(criteria);
            }

            result.TotalItem = criteria.TotalItem;

            return result;
        }

        public ResultGridData<SourceLicenseeSettingResult> Add(NewSourceLicenseeCriteria criteria)
        {
            var result = new ResultGridData<SourceLicenseeSettingResult>();

            using (var db = _objectDbGenerator.Create("Nap_LM_SourceLicensee_Insert"))
            {
                result.Data = db.Query<SourceLicenseeSettingResult>(criteria);
            }

            result.TotalItem = criteria.AffectedRow;

            return result;
        }
    }
}