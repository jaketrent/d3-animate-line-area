var path = require('path');
var postcssImport = require('postcss-import')
var postcssUrl = require('postcss-url')
var cssNext = require('postcss-cssnext')
var postcssBrowserReporter = require('postcss-browser-reporter')
var postcssReporter = require('postcss-reporter')
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.css$/,
      loader: 'style!css?modules&importLoaders=1&localIdentName=[name]---local---[hash:base64:5]!postcss'
    }]
  },
  postcss: [
    postcssImport,
    postcssUrl({ url: function (url) { return url } }),
    cssNext,
    postcssBrowserReporter,
    postcssReporter
  ],
};
