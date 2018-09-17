const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    babelLoaders: [{
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader'
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
                        url: false,
                        sourceMap: !isProduction
                    },
                }, {
                    loader: 'sass-loader',
                    options: {
                        minimize: isProduction,
                        url: false,
                        sourceMap: !isProduction
                    }
                }],
                // use style-loader in development
                fallback: 'style-loader'
            })
        }
    }
}