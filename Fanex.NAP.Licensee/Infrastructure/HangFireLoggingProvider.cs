namespace Fanex.NAP.Licensee.Infrastructure
{
    using Hangfire.Logging;

    public class HangFireLoggingProvider : ILogProvider
    {
        public ILog GetLogger(string name) => new HangFireLoggingLogger();
    }
}