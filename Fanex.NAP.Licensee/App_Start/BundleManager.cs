using System;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Fanex.NAP.Licensee.App_Start
{
    public static class BundleManager
    {
        private const string SupportedBundles = "/reactpages/";

        private static readonly string BundlesVersion = ConfigurationManager.AppSettings["BundlesVersion"];

        private static string BundleVersion => string.IsNullOrEmpty(BundlesVersion) ? DateTime.Now.Ticks.ToString() : BundlesVersion;

        private static string Environment => string.IsNullOrEmpty(BundlesVersion) ? "dev" : "pro";

        public static IHtmlString IncludeScriptsByEnv(params string[] scripts)
        {
            var newPaths = scripts.Select(s => IsSupportedBundles(s) ? ResolveJsLink(s) : s);
            return IncludeScripts(newPaths.ToArray());
        }

        public static IHtmlString IncludeStylesByEnv(params string[] styles)
        {
            var newPaths = styles.Select(s => IsSupportedBundles(s) ? ResolveCssLink(s) : s);
            return IncludeStyles(newPaths.ToArray());
        }

        private static IHtmlString IncludeScripts(params string[] scripts)
        {
            const string ScriptTag = "<script src=\"{0}?_={1}\"></script>";
            var tagScripts = scripts.Select(s => string.Format(ScriptTag, ResolveLink(s), BundleVersion));
            return new HtmlString(string.Join("\n", tagScripts));
        }

        private static IHtmlString IncludeStyles(params string[] stylePaths)
        {
            const string LinkTag = "<link href=\"{0}?_={1}\" rel=\"stylesheet\"/>";
            var tagLinks = stylePaths.Select(s => string.Format(LinkTag, ResolveLink(s), BundleVersion));
            return new HtmlString(string.Join("\n", tagLinks));
        }

        private static string ResolveLink(string link) => link[0] == '~' ? VirtualPathUtility.ToAbsolute(link) : link;

        private static bool IsSupportedBundles(string link) => link.IndexOf(SupportedBundles, StringComparison.OrdinalIgnoreCase) >= 0;

        private static string ResolveJsLink(string link) => link.Replace("/dist/js/", $"/dist/js/{Environment}/");

        private static string ResolveCssLink(string link) => link.Replace("/dist/css/", $"/dist/css/{Environment}/");
    }
}