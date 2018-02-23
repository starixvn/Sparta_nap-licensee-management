const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pathConfig = require('./path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let cleanOptions = {
    root: `${pathConfig.projectRoot}`,
    exclude: [],
    verbose: true,
    dry: false
}

module.exports = function generatePlugins(environment, commonChunkNames = []) {
    let pathsToClean = [`${pathConfig.scriptPaths.build}/${environment}`];

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
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions)
    ];
}