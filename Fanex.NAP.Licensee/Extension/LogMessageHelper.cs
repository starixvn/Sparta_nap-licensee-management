namespace Fanex.NAP.Licensee.Extension
{
    using System;
    using System.Collections.Generic;
    using System.Collections.Specialized;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Text;
    using System.Web;
    using Fanex.Data;

    public static class LogMessageHelper
    {
        public static string GenerateMessage(Exception exception)
        {
            var messageBuilder = new StringBuilder();

            messageBuilder.AppendLine($"ErrMsg: {exception.Message}");

            AddRequestInfo(messageBuilder);

            AddDatabaseInfo(messageBuilder, exception);

            AddExceptionInfo(messageBuilder, exception);

            return messageBuilder.ToString();
        }

        private static void AddRequestInfo(StringBuilder builder)
        {
            builder.AppendLine();
            builder.AppendLine("REQUEST INFO");

            var webInfo = GetRequestInfo();

            foreach (var item in webInfo)
            {
                builder.AppendLine($"{item.Key}: {item.Value}");
            }
        }

        private static void AddDatabaseInfo(StringBuilder builder, Exception exception)
        {
            builder.AppendLine();
            builder.AppendLine("DATABASE INFO");

            var dbInfo = GetObjectDbExceptionInfo(exception);

            foreach (var item in dbInfo)
            {
                builder.AppendLine($"{item.Key}: {item.Value}");
            }
        }

        private static void AddExceptionInfo(StringBuilder builder, Exception exception, int limitedInnerException = 3)
        {
            builder.AppendLine();
            builder.AppendLine("EXCEPTION INFO");
            builder.AppendLine($"Source: {exception.Source}");
            builder.AppendLine($"TargetSite: {exception.TargetSite}");
            builder.AppendLine($"StackTrace: {exception.StackTrace}");

            if (exception.InnerException != null && limitedInnerException > 0)
            {
                limitedInnerException--;
                AddExceptionInfo(builder, exception.InnerException, limitedInnerException);
            }
        }

        private static IDictionary<string, object> GetObjectDbExceptionInfo(Exception ex)
        {
            if (ex is ObjectDbException)
            {
                var dbException = ex as ObjectDbException;
                var connString = new SqlConnectionStringBuilder(dbException.DbSetting.ConnectionString);

                return new Dictionary<string, object>
                {
                    ["Server"] = connString.DataSource,
                    [nameof(dbException.DbSetting.DbName)] = dbException.DbSetting.DbName,
                    [nameof(connString.UserID)] = connString.UserID,
                    [nameof(dbException.DbSetting.SpName)] = dbException.DbSetting.SpName
                };
            }
            return new Dictionary<string, object>();
        }

        private static string GetParameters(IDictionary<string, object> parameters)
           => parameters.Count > 0
               ? parameters.Select(parameter => $"{parameter.Key}={parameter.Value}")
                       .Aggregate((firstPair, secondPair) => $"{firstPair};{secondPair}")
               : string.Empty;

        private static IDictionary<string, object> GetRequestInfo()
        {
            var request = HttpContext.Current?.Request;
            return request == null
                    ? new Dictionary<string, object>()
                    : new Dictionary<string, object>
                    {
                        [nameof(request.Url)] = request.Url,
                        [nameof(request.UrlReferrer)] = request.UrlReferrer,
                        [nameof(request.Form)] = request.Form,
                        [nameof(request.UserHostAddress)] = request.UserHostAddress,
                        [nameof(request.UserAgent)] = GetUserAgent(request.ServerVariables),
                        ["Client IP"] = GetClientIP(request?.ServerVariables),
                        ["Identity"] = HttpContext.Current.User?.Identity?.Name
                    };
        }

        private static string GetClientIP(NameValueCollection serverVariables)
        {
            var clientIP = serverVariables["HTTP_X_FORWARDED_FOR"]
                ?? serverVariables["REMOTE_ADDR"]
                ?? string.Empty;

            return string.IsNullOrEmpty(clientIP) || clientIP.Equals("::1")
                ? "127.0.0.1"
                : clientIP;
        }

        private static string GetUserAgent(NameValueCollection serverVariables)
            => serverVariables["HTTP_USER_AGENT"];
    }
}