const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./src/index.ts'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      { from: 'index.html', to: 'index.html' },
      { from: 'assets/', to: 'assets' },
      { from: 'favicon.ico', to: 'favicon.ico' }
    ])
  ]
};
