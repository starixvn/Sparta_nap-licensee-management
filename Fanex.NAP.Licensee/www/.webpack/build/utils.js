const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

exports.setDefinePlugin = function (key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    };
};

exports.minify = function () {
    return {
        plugins: [
            new UglifyJsPlugin({
                parallel: true,
                uglifyOptions: {
                    warnings: true,
                    compress: {
                        drop_console: true
                    }
                }
            })
        ]
    };
};

exports.generateEntries = function generateEntries(environment, configs, prefix, name) {
    let entries = {};

    if (typeof configs === 'string') {
        entries[`${prefix}/${name}`] = configs;
    } else if (typeof configs === 'object') {
        Object.keys(configs).forEach(key => {
            if (key === 'build') {
                return;
            }
            entries = Object.assign(entries, generateEntries(environment, configs[key], prefix
                ? `${prefix}/${key}`
                : `${configs.build}/${environment}/${key}`, key));
        });
    }

    return entries;
}