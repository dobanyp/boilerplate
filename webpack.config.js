const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
    mode: 'development',
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            targets: "defaults"
                        }]
                    ]
                }
            }
        }]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './app/index.html'
    })]
};