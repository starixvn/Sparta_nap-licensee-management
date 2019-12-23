namespace Fanex.NAP.Licensee.Infrastructure
{
    using System;
    using Extension;
    using Hangfire.Logging;
    using Logging;

    public class HangFireLoggingLogger : ILog
    {
        public bool Log(LogLevel logLevel, Func<string> messageFunc, Exception exception = null)
        {
            if (exception != null)
            {
                LogService.Error(LogMessageHelper.GenerateMessage(exception), exception);
            }

            return true;
        }
    }
}