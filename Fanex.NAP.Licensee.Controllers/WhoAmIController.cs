namespace Fanex.NAP.Licensee.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
    using System.Text;
    using System.Web.Mvc;
    using Data.Vault;

    [AllowAnonymous]
    public class WhoAmIController : Controller
    {
        private const string HeaderFormat = "<div><h4>{0}</h4></div>";
        private const string LineFormat = "<div>{0}: {1}</div>";
        private readonly VaultDbAliasService _vaultDbAliasService = new VaultDbAliasServiceImp();

        public ActionResult Index()
        {
            StringBuilder builder = new StringBuilder();

            AddServerInfo(builder);
            AddDatabaseAliasInfo(builder);

            return Content(builder.ToString());
        }

        private void AddServerInfo(StringBuilder builder)
        {
            builder.AppendFormat(HeaderFormat, "SERVER INFO");
            builder.AppendFormat(LineFormat, "Web Name", Request.ServerVariables["Server_Name"]);
            builder.AppendFormat(LineFormat, "Port", Request.Url.Port);
            builder.AppendFormat(LineFormat, "Server IP", Request.ServerVariables["LOCAL_ADDR"]);
            builder.AppendFormat(LineFormat, "Server Time", DateTime.Now);
            builder.AppendFormat(LineFormat, "Client IP", Request.UserHostAddress);
            builder.AppendFormat(LineFormat, "HTTP_X_FORWARDED_FOR", Request.ServerVariables["HTTP_X_FORWARDED_FOR"]);
            builder.AppendFormat(LineFormat, "HTTP_X_ACTUAL_IP", Request.ServerVariables["HTTP_X_ACTUAL_IP"]);
            builder.AppendFormat(LineFormat, "HTTP_VIA", Request.ServerVariables["HTTP_VIA"]);
            builder.AppendFormat(LineFormat, "HTTP_PROXY_CONNECTION", Request.ServerVariables["HTTP_PROXY_CONNECTION"]);
        }

        private void AddDatabaseAliasInfo(StringBuilder builder)
        {
            List<string> dbAliasList = ConfigurationManager.ConnectionStrings
                .Cast<ConnectionStringSettings>()
                .Where(connectionStringSetting => !string.IsNullOrEmpty(connectionStringSetting.ConnectionString))
                .Select(connectionStringSetting => connectionStringSetting.Name.Split('.')[0])
                .Distinct()
                .ToList();

            builder.AppendFormat(HeaderFormat, "DB ALIAS INFO");

            foreach (string dbAlias in dbAliasList)
            {
                builder.AppendFormat(LineFormat, dbAlias, _vaultDbAliasService.GetIp(dbAlias));
            }
        }
    }
}