namespace Fanex.NAP.Licensee.Service.Helpers
{
    using System.Linq;
    using System.Web;

    public static class HttpRequestHelper
    {
        private const string HttpXForwardedFor = "HTTP_X_FORWARDED_FOR";
        private const string HttpXActualIp = "HTTP_X_ACTUAL_IP";
        private const string LocalIp = "127.0.0.1";

        public static string GetClientIp(HttpRequest request)
        {
            return GetClientIp(new HttpRequestWrapper(request));
        }

        public static string GetClientIp(HttpRequestBase request)
        {
            var xActualIp = request.ServerVariables?[HttpXActualIp];
            var xForwardedFor = !string.IsNullOrWhiteSpace(xActualIp)
                ? xActualIp
                : request.ServerVariables?[HttpXForwardedFor];

            var clientIp = xForwardedFor?.Split(',').FirstOrDefault()?.Trim();

            if (string.IsNullOrWhiteSpace(clientIp))
            {
                clientIp = request.UserHostAddress;
            }

            return !string.IsNullOrWhiteSpace(clientIp) && clientIp.Equals("::1") ? LocalIp : clientIp;
        }
    }
}
