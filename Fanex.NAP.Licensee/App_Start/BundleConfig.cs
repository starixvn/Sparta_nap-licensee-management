using System.Web.Optimization;
using BundleTransformer.Core.Builders;
using BundleTransformer.Core.Orderers;
using BundleTransformer.Core.Resolvers;
using BundleTransformer.Core.Transformers;

namespace Fanex.NAP.Licensee.AppStart
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            var cssTransformer = new StyleTransformer();
            var jsTransformer = new ScriptTransformer();
            var nullBuilder = new NullBuilder();
            var nullOrderer = new NullOrderer();
            // Replace a default bundle resolver in order to the debugging HTTP-handler
            // can use transformations of the corresponding bundle
            BundleResolver.Current = new CustomBundleResolver();

            var css = new Bundle("~/bundles/coreCss")
            .Include("~/Content/jquery-ui/base/all.css")
            .Include("~/Content/bootstrap/bootstrap.less")
           .Include("~/Content/Plugin/multi-select-control.css")
           .Include("~/Content/Core/site.less");
            css.Builder = nullBuilder;
            css.Transforms.Add(cssTransformer);
            css.Orderer = nullOrderer;

            bundles.Add(css);

            var cssFanexGrid = new Bundle("~/bundles/FanexGridCss")
             .IncludeDirectory("~/Content/Fanex.Grid", "*.css");
            cssFanexGrid.Builder = nullBuilder;
            cssFanexGrid.Transforms.Add(cssTransformer);
            cssFanexGrid.Orderer = nullOrderer;
            
            bundles.Add(cssFanexGrid);

            var headJs = new Bundle("~/bundles/head")
                .Include("~/Scripts/head.js",
                "~/Scripts/respond.js");

            headJs.Builder = nullBuilder;
            headJs.Transforms.Add(jsTransformer);
            headJs.Orderer = nullOrderer;

            bundles.Add(headJs);

            var coreJs = new Bundle("~/bundles/coreJs")
                .Include("~/Scripts/jquery-1.9.0.js",
                "~/Scripts/jquery-ui-1.11.1.js",
                 "~/Scripts/Plugin/multi-select-control.js", 
                "~/Scripts/bootstrap.js", "~/Scripts/Core/site.js",
                "~/Scripts/Page/addnew.js"
                , "~/Scripts/Page/default.js",
                "~/Scripts/Page/edit.js",
                 "~/Scripts/Page/viewlog.js"
                );

            coreJs.Builder = nullBuilder;
            coreJs.Transforms.Add(jsTransformer);
            coreJs.Orderer = nullOrderer;

            bundles.Add(coreJs);


            var fanexGridJs = new Bundle("~/bundles/FanexGridJs")
            .IncludeDirectory("~/Scripts/Fanex.Grid", "*.js", true);

            fanexGridJs.Builder = nullBuilder;
            fanexGridJs.Transforms.Add(jsTransformer);
            fanexGridJs.Orderer = nullOrderer;

            bundles.Add(fanexGridJs);
            // If you'd like to test the optimization locally,
            // you can use this line to force it.
            BundleTable.EnableOptimizations = true;
        }
    }
}