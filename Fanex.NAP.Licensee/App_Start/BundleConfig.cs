namespace Fanex.NAP.Licensee.AppStart
{
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Optimization;
    using Fanex.NAP.Licensee.Model.Extensions;

    /// <summary>
    /// Bundle configuration.
    /// </summary>
    public static class BundleConfig
    {
        /// <summary>
        /// Register JS , CSS in a bundle.
        /// </summary>
        /// <param name="bundles">The bundle collection.</param>
        [SuppressMessage(
                     "StyleCop.CSharp.Nexcel.NexcelCustomRules",
                     "SP2101:MethodMustNotContainMoreLinesThan",
                     Justification = "Reviewed. Suppression is OK here.")]
        public static void RegisterBundles(BundleCollection bundles)
        {
            AngularJs(bundles);
            FanexGrid(bundles);
            Core(bundles);
            Login(bundles);
            RecheckIn(bundles);
            DefaultBetSetting(bundles);
            SettingConfiguration(bundles);

            // BundleTable.EnableOptimizations = true;
        }

        private static void AngularJs(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/angularJS").Include(
                "~/Scripts/angular/angular.min.js",
                "~/Scripts/angular/angular-route.min.js",
                "~/Scripts/angular/angular-animate.min.js"));
        }

        private static void Core(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/coreJs").Include(
                "~/Scripts/jquery/jquery-1.9.0.js",
                "~/Scripts/jquery/jquery-ui.1.11.4.js",
                "~/Scripts/jquery/jquery.number.js",
                "~/Scripts/jquery/numeric.js",
                "~/Scripts/plugin/multi-select-control.js",
                "~/Scripts/bootstrap/bootstrap.js",
                "~/Scripts/core/site.js"));
            bundles.AddWithCssRewrite(
                "~/bundles/coreCss",
                "~/Content/bootstrap/bootstrap.min.css",
                "~/Content/core/site.min.css",
                "~/Content/plugin/multi-select-control.min.css",
                "~/Content/jquery-ui/jquery-ui.min.css",
                "~/Content/jquery-ui/jquery-ui.theme.min.css",
                "~/Content/jquery-ui/jquery-ui.structure.min.css");
        }

        private static void Login(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/loginJs").Include(
                "~/Scripts/jquery/jquery-1.9.0.js",
                "~/Areas/UserLogin/scripts/Login.js",
                "~/Scripts/cryptoJs.js"));
        }

        private static void RecheckIn(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundle/recheckInJs").Include("~/Areas/UserLogin/scripts/ReCheckIn.js"));
        }

        private static void FanexGrid(BundleCollection bundles)
        {
            bundles.AddWithCssRewrite("~/bundles/fanexGridCss", "~/Content/fanex.grid/Fanex.Grid.min.css", "~/Content/fanex.grid/Fanex.Pagination.min.css");
            bundles.Add(new ScriptBundle("~/bundles/fanexGridJs").IncludeDirectory("~/Scripts/fanex.grid", "*.js", true));
        }

        private static void DefaultBetSetting(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/defaultBetSettingJs").Include(
                "~/Scripts/page/defaultbetsetting/addnew.js",
                "~/Scripts/page/defaultbetsetting/default.js",
                "~/Scripts/page/defaultbetsetting/edit.js",
                "~/Scripts/page/defaultbetsetting/viewlog.js"));
        }

        private static void SettingConfiguration(BundleCollection bundles)
        {
            bundles.AddWithCssRewrite("~/bundles/settingConfigurationCss", "~/Content/settingconfiguration/setting-configuration.min.css");
            bundles.Add(new ScriptBundle("~/bundles/settingConfigurationJs").IncludeDirectory("~/Scripts/page/settingconfiguration/", "*.js", true));
        }
    }
}