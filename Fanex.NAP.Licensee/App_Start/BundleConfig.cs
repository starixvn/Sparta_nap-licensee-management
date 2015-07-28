namespace Fanex.NAP.Licensee.AppStart
{
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Optimization;
    using BundleTransformer.Core.Resolvers;
    using BundleTransformer.Core.Transformers;

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
            var cssTransformer = new StyleTransformer();

            var scriptTransformer = new ScriptTransformer();
            BundleResolver.Current = new CustomBundleResolver();

            AngularJs(bundles, scriptTransformer);
            FanexGrid(bundles, cssTransformer, scriptTransformer);
            Core(bundles, cssTransformer, scriptTransformer);
            Login(bundles, scriptTransformer);
            RecheckIn(bundles, scriptTransformer);
            DefaultBetSetting(bundles, scriptTransformer);
            SettingConfiguration(bundles, cssTransformer, scriptTransformer);

            /*If you'd like to test the optimization locally,
            you can use this line to force it.*/
            BundleTable.EnableOptimizations = true;
        }

        private static void AngularJs(BundleCollection bundles, ScriptTransformer scriptTransformer)
        {
            var angularJs = new Bundle("~/bundle/AngularJS")
                       .Include("~/scripts/angular/angular.min.js")
                        .Include("~/scripts/angular/angular-route.min.js")
                           .Include("~/scripts/angular/angular-animate.min.js");

            angularJs.Transforms.Add(scriptTransformer);
            bundles.Add(angularJs);
        }

        private static void Core(BundleCollection bundles, StyleTransformer cssTransformer, ScriptTransformer scriptTransformer)
        {
            var css = new Bundle("~/bundles/coreCss")
            .Include("~/Content/bootstrap/bootstrap.less")
           .Include("~/Content/Core/site.less")
           .Include("~/Content/Plugin/multi-select-control.css")
           .Include("~/Content/jquery-ui/jquery-ui.min.css")
           .Include("~/Content/jquery-ui/jquery-ui.theme.min.css")
           .Include("~/Content/jquery-ui/jquery-ui.structure.min.css");

            css.Transforms.Add(cssTransformer);

            bundles.Add(css);

            var coreJs = new Bundle("~/bundles/coreJs")
                .Include(
                    "~/Scripts/jquery-1.9.0.min.js",
                    "~/Scripts/jquery-ui.min.1.11.4.js",
                    "~/Scripts/jquery.number.js",
                    "~/Scripts/numeric.js",
                    "~/Scripts/Plugin/multi-select-control.js",
                    "~/Scripts/bootstrap.min.js",
                    "~/Scripts/Core/site.js");
            coreJs.Transforms.Add(scriptTransformer);
            bundles.Add(coreJs);
        }

        private static void Login(BundleCollection bundles, ScriptTransformer scriptTransformer)
        {
            var loginJs = new Bundle("~/bundles/loginJs")
                .Include("~/Scripts/jquery-1.9.0.min.js", 
                        "~/Areas/UserLogin/scripts/Login.js",
                        "~/Scripts/CryptoJS.js");

            loginJs.Transforms.Add(scriptTransformer);
            bundles.Add(loginJs);
        }

        private static void RecheckIn(BundleCollection bundles, ScriptTransformer scriptTransformer)
        {
            var recheckInJs = new Bundle("~/bundles/recheckInJs")
                                .Include("~/Areas/UserLogin/scripts/ReCheckIn.js");

            recheckInJs.Transforms.Add(scriptTransformer);
            bundles.Add(recheckInJs);
        }

        private static void FanexGrid(BundleCollection bundles, StyleTransformer cssTransformer, ScriptTransformer scriptTransformer)
        {
            var cssFanexGrid = new Bundle("~/bundles/FanexGridCss")
                .IncludeDirectory("~/Content/Fanex.Grid", "*.css");
            cssFanexGrid.Transforms.Add(cssTransformer);
            bundles.Add(cssFanexGrid);

            var fanexGridJs = new Bundle("~/bundles/FanexGridJs")
                .IncludeDirectory("~/Scripts/Fanex.Grid", "*.js", true);

            fanexGridJs.Transforms.Add(scriptTransformer);
            bundles.Add(fanexGridJs);
        }

        private static void DefaultBetSetting(BundleCollection bundles, ScriptTransformer scriptTransformer)
        {
            var defaultBetSettingJs = new Bundle("~/bundles/DefaultBetSettingJs")
                .Include(
                "~/Scripts/Page/DefaultBetSetting/addnew.js",
                 "~/Scripts/Page/DefaultBetSetting/default.js",
                "~/Scripts/Page/DefaultBetSetting/edit.js",
                 "~/Scripts/Page/DefaultBetSetting/viewlog.js");

            defaultBetSettingJs.Transforms.Add(scriptTransformer);
            bundles.Add(defaultBetSettingJs);
        }

        private static void SettingConfiguration(BundleCollection bundles, StyleTransformer cssTransformer, ScriptTransformer scriptTransformer)
        {
            var cssSettingConfiguration = new Bundle("~/bundles/settingConfigurationCss")
                .IncludeDirectory("~/Content/SettingConfiguration", "*.less");

            cssSettingConfiguration.Transforms.Add(cssTransformer);
            bundles.Add(cssSettingConfiguration);

            var settingConfigurationJs = new Bundle("~/bundles/settingConfigurationJs")
                .IncludeDirectory("~/Scripts/page/SettingConfiguration/", "*.js", true);

            settingConfigurationJs.Transforms.Add(scriptTransformer);
            bundles.Add(settingConfigurationJs);
        }
    }
}