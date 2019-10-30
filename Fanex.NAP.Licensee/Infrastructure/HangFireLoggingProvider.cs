namespace Fanex.NAP.Licensee.Infrastructure
{
    using System;
    using Hangfire.Logging;

    public class HangFireLoggingProvider : ILogProvider
    {
        public ILog GetLogger(string name) => new NoLoggingLogger();
    }

    public class NoLoggingLogger : ILog
    {
        public bool Log(LogLevel logLevel, Func<string> messageFunc, Exception exception = null) => false;
    }
}