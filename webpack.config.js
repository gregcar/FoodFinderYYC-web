const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const config = require('./config.json');

const srcPath = __dirname + '/src';
const distPath = __dirname + '/dist';

const htmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: srcPath + '/index.html',
  filename: 'index.html',
  inject: true
});

const vendorConfig = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function (module) {
    // this assumes your vendor imports exist in the node_modules directory
    return module.context && module.context.indexOf('node_modules') !== -1;
  }
});

// CommonChunksPlugin will now extract all the common modules from vendor and main bundles
const manifestConfig = new webpack.optimize.CommonsChunkPlugin({
  name: 'common' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
});

const scssConfig = new ExtractTextWebpackPlugin({
  filename: "[name].[contenthash].css",
  allChunks: true
});

const faviconConfig = new FaviconsWebpackPlugin(srcPath + '/ffyyc-favicon.png');

const appConfig = new webpack.DefinePlugin({
  ENV: {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  },
  PARSE: {
    APP_ID: JSON.stringify(config.parse.app_id),
    JS_KEY: JSON.stringify(config.parse.js_key),
    URL: JSON.stringify(config.parse.url)
  },
  GOOGLE: {
    MAP: JSON.stringify(config.google.map),
    ZOOM: JSON.stringify(config.google.zoom),
    GA: JSON.stringify(config.google.ga)
  }
});

module.exports = function() {
  'use strict';

  return {
    entry: [
      srcPath + '/js/main.js',
      srcPath + '/scss/main.scss'
    ],
    output: {
      filename: '[name].[hash].js',
      path: distPath
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        }, {
          test: /\.css$/,
          use: scssConfig.extract(['css-loader'])
        }, {
          test: /\.(sass|scss)$/,
          use: scssConfig.extract({
            fallback: ['style-loader'],
            loader: [{
              loader: 'css-loader',
              query: {
                minimize: false,
                sourceMap: true
              }
            }, {
              loader: 'sass-loader',
              query: {
                sourceMap: true,
                sourceMapContents: true
              }
            }]
          })
        }, {
          test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
          use: 'file-loader?name=fonts/[name].[ext]'
        }, {
          test: /\.(jpg|jpeg|gif|png|svg)$/,
          use: 'file-loader?name=img/[name].[ext]'
        }
      ]
    },
    devtool: 'source-map',
    devServer: { historyApiFallback: true },
    plugins: [
      appConfig,
      vendorConfig,
      manifestConfig,
      faviconConfig,
      htmlWebpackPluginConfig,
      scssConfig
    ]
  };
};
