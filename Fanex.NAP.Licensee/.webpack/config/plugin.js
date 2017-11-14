const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pathConfig = require('./path');

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
        })
    ];
}