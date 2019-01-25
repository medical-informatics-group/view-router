const {join} = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = join(__dirname, 'build');

module.exports = {
  context: join(__dirname),
  target: 'web',
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules', 'src']
  },
  entry: {
    app: './src/index.js'
  },
  output: {
    path: outputPath,
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './node_modules/@webcomponents/webcomponentsjs',
      to: 'polyfills/webcomponentsjs'
    }]),
    new CopyWebpackPlugin([{
      from: './src/data',
      to: 'data'
    }]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    contentBase: outputPath
  }
};
