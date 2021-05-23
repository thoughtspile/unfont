const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new HtmlWebpackPlugin({ filename: 'inline.html', template: 'src/inline.html' }),
  ],
}
