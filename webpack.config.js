const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require("webpackbar");

const ENTRY_PATH = './src/js/main.js';
const OUTPUT_PATH = 'public';
const OUTPUT_FILENAME = 'js/[name].js';
const OUTPUT_PUBLIC_PATH = '/';
const CSS_EXTRACT_FILENAME = 'css/styles.css';

const WEBPACK_DEVSERVER_CONTENT_BASE = 'public';
const WEBPACK_DEVSERVER_PORT = 5050;

module.exports = (env = {}) => ({
  mode: env.prod ? 'production' : 'development',
  watchOptions: {
    ignored: '**/node_modules',
  },
  entry: [
    path.resolve(__dirname, ENTRY_PATH),
  ],
  output: {
    path: path.resolve(__dirname, OUTPUT_PATH),
    filename: OUTPUT_FILENAME,
    publicPath: OUTPUT_PUBLIC_PATH
  },
  resolve: {
    
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 }
        }
      },
      {
        test: /\.(sass|scss|css)$/,
        exclude: /(node_modules)/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: env.prod,
    minimizer: [
      new TerserJSPlugin({}),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!index.php', '!index.html']
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: CSS_EXTRACT_FILENAME,
    }),
    new WebpackBar()
  ],
  devtool: 'source-map',
  devServer: {
      contentBase: path.join(__dirname, WEBPACK_DEVSERVER_CONTENT_BASE),
      port: WEBPACK_DEVSERVER_PORT,
      compress: true,
  }
});