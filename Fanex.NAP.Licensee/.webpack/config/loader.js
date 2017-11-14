const ExtractTextPlugin = require('extract-text-webpack-plugin');
const configPath = require('./path');
const path = require('path');

module.exports = {
    babelLoaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                plugins: [require('babel-plugin-transform-object-rest-spread')],
                presets: ['es2015', 'react']
            }
        }
    }],
    cssUrlLoaders: [{
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
            limit: 1024,
            publicPath: url => `../images/${path.basename(url)}`,
            name: '[name].[ext]?[hash]',
            outputPath: './reactpages/dist/images/'
        }
    }],
    generateSassLoaders: isProduction => {
        return {
            test: /\.s?css$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: isProduction ? {
                        minimize: {
                            discardComments: {
                                removeAll: true
                            }
                        }
                    } : {}
                }, {
                    loader: 'sass-loader'
                }],
                // use style-loader in development
                fallback: 'style-loader'
            })
        }
    }
}