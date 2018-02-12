const ExtractTextPlugin = require('extract-text-webpack-plugin');
const configPath = require('./path');
const path = require('path');

module.exports = {
    babelLoaders: [{
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                plugins: [require('babel-plugin-transform-object-rest-spread')],
                presets: ['es2015', 'react']
            }
        }
    }],
    generateSassLoaders: isProduction => {
        return {
            test: /\.s?css$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: isProduction ? 
                            {
                                discardComments: {
                                    removeAll: true
                                }
                            }: false,
                        url: false
                    },
                }, {
                    loader: 'sass-loader',
                    options: {
                        minimize: isProduction,
                        url: false
                    }
                }],
                // use style-loader in development
                fallback: 'style-loader'
            })
        }
    }
}