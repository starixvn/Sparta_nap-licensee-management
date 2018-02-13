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
        new ExtractTextPlugin({
            allChunks: true,
            filename: '[name].css',
            disable: false
        })        
    ];
}