using Fanex.NAP.Licensee.Model.Criteria.Vendor;

namespace Fanex.NAP.Licensee.Service
{
    public interface ILogWriterService
    {
        void WriteActionLog(ActionLogCriteria criteria);
    }
}
