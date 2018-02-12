const path = require('path');
const merge = require('webpack-merge');

const alias = require('../config/alias');
const pathConfig = require('../config/path');
const pluginGenerator = require('../config/plugin');
const loader = require('../config/loader');
const utils = require('./utils');

function generateConfig(environment) {
    const entries = Object.assign({
            'vendor': ['react', 'react-dom']
        },
        utils.generateEntries(environment, pathConfig.scriptPaths),
        utils.generateEntries(environment, pathConfig.cssPaths)
    );

    return {
        context: pathConfig.projectRoot,
        resolve: {
            alias: alias,
            extensions: ['.js', '.jsx']
        },
        entry: entries,
        output: {
            path: pathConfig.projectRoot,
            filename: "[name].js"
        },
        module: {
            rules: [
                ...loader.babelLoaders,             
            ]
        },
        plugins: pluginGenerator(environment),
        // use external libraries that not bundled by webpack
        //externals: {
        //    "jquery": 'jQuery'
        //},
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            children: true
        }
    };
}

module.exports = generateConfig;