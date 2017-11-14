const webpack = require('webpack');
const merge = require('webpack-merge');
const utils = require('./utils');
const baseWebpackConfigGenerator = require('./webpack.base.conf');
const loader = require('../config/loader');

module.exports = merge(
    baseWebpackConfigGenerator('pro'),
    utils.setDefinePlugin('process.env.NODE_ENV', 'production'),
    utils.minify(), {
        devtool: 'source-map',
        module: {
            loaders: [loader.generateSassLoaders(true)]
        }
    }
);