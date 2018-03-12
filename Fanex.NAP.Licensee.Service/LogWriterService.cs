namespace Fanex.NAP.Licensee.Service
{
    using Core;
    using Fanex.NAP.Licensee.Model.Criteria.Vendor;

    public class LogWriterService : ILogWriterService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;

        public LogWriterService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public void WriteActionLog(ActionLogCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                db.ExecuteNonQuery(criteria.GetSpParams());
            }
        }
    }
}