var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname + '/app',
  entry: './scripts/drforna.js',
  output: {
    path: __dirname + '/build',
    filename: 'drforna.js',
    libraryTarget: 'var',
    library: 'drforna'
  },
  module: {
    loaders: [
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    }
  }
};
