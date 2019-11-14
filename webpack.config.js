const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/siema.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'siema.min.js',
    library: 'Siema',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['babel-plugin-add-module-exports'],
        },
      },
    ],
  },
};
