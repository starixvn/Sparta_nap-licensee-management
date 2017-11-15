const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pathConfig = require('./path');
const fs = require('fs');

class BundleVersionPlugin {
    _onEmit(compilation) {
        const siteConfigPath = `${pathConfig.projectRoot}/SiteConfig`;
        fs.readdir(siteConfigPath, (err, files) => {
            files.filter(name => name.match(/Web\.AppSettings\.[^\.]+\.config/i))
                .forEach(name => {
                    const filePath = `${siteConfigPath}/${name}`;
                    const content = fs.readFileSync(filePath, 'utf8');
                    let isChanged = false;

                    const newContent = content.replace(/BundlesVersion[^>]+value="([^"]+)"[^>]+>/, function (matchedString, buildNumber) {
                        return (isChanged = (compilation.hash !== buildNumber))
                            ? matchedString.replace(buildNumber, compilation.hash)
                            : matchedString;
                    });

                    if (isChanged) {
                        fs.writeFile(filePath, newContent);
                    }
                });
        })
    }

    apply(compiler) {
        compiler.plugin('emit', this._onEmit);
    }
}

module.exports = function generatePlugins(environment, commonChunkNames = []) {
    return [
        // use this plugin to exclude node modules
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            filename: `${pathConfig.scriptPaths.build}/${environment}/[name].js`,
            minChunks: Infinity
        }),
        // use jquery plugin: wherever these symbols are used, they will be replace by jquery module from webpack
        //new webpack.ProvidePlugin({
        //    $: 'jquery',
        //    jQuery: 'jquery',
        //    jquery: 'jquery',
        //    "window.$": 'jquery',
        //    "window.jQuery": 'jquery',
        //    "root.jQuery": 'jquery'
        //})
        new ExtractTextPlugin({
            allChunks: true,
            filename: '[name].css',
            disable: false
        }), 
        new BundleVersionPlugin()
    ];
}