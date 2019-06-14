var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'app'),
  entry: {drforna: ['./scripts/drforna.js'],
          drforna_interface: './scripts/interface.js'},
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|bower_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      },
      {
          test: /\.css$/,
          loader: ['style-loader','css-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
