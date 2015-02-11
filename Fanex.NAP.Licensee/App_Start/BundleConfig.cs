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
            cssTransformer.CombineFilesBeforeMinification = true;

            var scriptTransformer = new ScriptTransformer();
            scriptTransformer.CombineFilesBeforeMinification = true;
            BundleResolver.Current = new CustomBundleResolver();

            var css = new Bundle("~/bundles/coreCss")
            .IncludeDirectory("~/Content/jquery-ui/base/", "*.css")
            .Include("~/Content/bootstrap/bootstrap.less")
           .Include("~/Content/Plugin/multi-select-control.css")
           .Include("~/Content/Core/site.less");

            css.Transforms.Add(cssTransformer);

            bundles.Add(css);

            var cssFanexGrid = new Bundle("~/bundles/FanexGridCss")
             .IncludeDirectory("~/Content/Fanex.Grid", "*.css");

            cssFanexGrid.Transforms.Add(cssTransformer);

            bundles.Add(cssFanexGrid);

            var coreJs = new Bundle("~/bundles/coreJs")
                .Include(
                "~/Scripts/jquery-1.9.0.js",
                "~/Scripts/jquery-ui-1.11.1.js",
                "~/Scripts/jquery.number.js",
                 "~/Scripts/Plugin/multi-select-control.js",
                "~/Scripts/bootstrap.js",
                "~/Scripts/Core/site.js");

            coreJs.Transforms.Add(scriptTransformer);

            bundles.Add(coreJs);

            // Core angularJs
            var coreAngularJs = new Bundle("~/bundles/coreAngularJs")
                .Include(
                "~/Scripts/angular/angular.min.js",
                "~/Scripts/angular/angular-route.min.js",
                "~/Scripts/angular/angular-animate.min.js");

            coreAngularJs.Transforms.Add(scriptTransformer);
            bundles.Add(coreAngularJs);

            // Setting configuration
            var settingConfigurationJs = new Bundle("~/bundles/settingConfigurationJs")
                .Include(
                "~/Scripts/Page/SettingConfiguration/Controllers/settingConfiguration.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/settingConfigurationController.js",
                "~/Scripts/Page/SettingConfiguration/Services/filterDataService.js",
                "~/Scripts/Page/SettingConfiguration/Services/shareSettingsService.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/PT/editPTController.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/PT/reviewPTController.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/Comm/editCommController.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/Comm/reviewCommController.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/editBSFuncs.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/editBSKenoCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/editBSNumberGameCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/editBSRacingCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/editBSSportbookCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/editBSVirtualSportCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/reviewBSFuncs.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/reviewBSKenoCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/reviewBSNumberGameCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/reviewBSRacingCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/reviewBSSportbookCtrl.js",
                "~/Scripts/Page/SettingConfiguration/Controllers/BetSetting/reviewBSSportbookCtrl.js");

            settingConfigurationJs.Transforms.Add(scriptTransformer);
            bundles.Add(settingConfigurationJs);

            var defaultBetSettingJs = new Bundle("~/bundles/DefaultBetSettingJs")
                .Include(
                "~/Scripts/Page/DefaultBetSetting/addnew.js",
                 "~/Scripts/Page/DefaultBetSetting/default.js",
                "~/Scripts/Page/DefaultBetSetting/edit.js",
                 "~/Scripts/Page/DefaultBetSetting/viewlog.js");

            defaultBetSettingJs.Transforms.Add(scriptTransformer);
            bundles.Add(defaultBetSettingJs);

            var fanexGridJs = new Bundle("~/bundles/FanexGridJs")
            .IncludeDirectory("~/Scripts/Fanex.Grid", "*.js", true);

            fanexGridJs.Transforms.Add(scriptTransformer);

            bundles.Add(fanexGridJs);
            /*If you'd like to test the optimization locally,
            you can use this line to force it.*/
            BundleTable.EnableOptimizations = true;
        }
    }
}