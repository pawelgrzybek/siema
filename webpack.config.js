const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/siema.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'siema.min.js',
    library: 'Siema',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['babel-plugin-add-module-exports'],
        },
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
    }),
  ],
};
