namespace Fanex.NAP.Licensee.Model.Extensions
{
    using System.Web;
    using System.Web.Optimization;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public static class BundlesExtension
    {
        public static void AddWithCssRewrite(this BundleCollection bundles, string bundleVirtualPath, params string[] includePaths)
        {
            var styleBundle = new StyleBundle(bundleVirtualPath);
            var cssRewrite = new CssRewriteUrl();

            styleBundle.IncludePaths(cssRewrite, includePaths);
            bundles.Add(styleBundle);
        }

        internal static void IncludePaths(this StyleBundle bundle, CssRewriteUrl transform, params string[] includePaths)
        {
            foreach (var path in includePaths)
            {
                bundle.Include(path, transform);
            }
        }

        internal class CssRewriteUrl : IItemTransform
        {
            public string Process(string includedVirtualPath, string input)
            {
                return new CssRewriteUrlTransform().Process("~" + VirtualPathUtility.ToAbsolute(includedVirtualPath), input);
            }
        }
    }
}