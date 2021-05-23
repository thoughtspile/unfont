const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    'svg-js': path.join(__dirname, 'src', 'svg-js.js'),
    'font': path.join(__dirname, 'src', 'font.css'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset",
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'svg-js.html',
      chunks: ['svg-js'],
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'font.html',
      chunks: ['font'],
    }),
    new HtmlWebpackPlugin({
      filename: 'inline.html',
      template: 'src/inline.html',
      chunks: [],
    }),
  ],
}
