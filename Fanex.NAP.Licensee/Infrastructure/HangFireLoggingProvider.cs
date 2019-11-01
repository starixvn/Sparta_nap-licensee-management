namespace Fanex.NAP.Licensee.Infrastructure
{
    using System;
    using Hangfire.Logging;

    public class HangFireLoggingProvider : ILogProvider
    {
        public ILog GetLogger(string name) => new HangFireLoggingLogger();
    }

    public class HangFireLoggingLogger : ILog
    {
        public bool Log(LogLevel logLevel, Func<string> messageFunc, Exception exception = null)
        {
            if (exception != null)
            {
                Logging.LogService.Error(exception.Message, exception);
            }
           
            return true;
        }
    }
}