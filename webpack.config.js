const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const configuration = {
  cssOutput: {
    filename: '[name].css',
    chunkFilename: '[name].chunk.css',
  },
};

module.exports = (_env, args) => {
  const isProduction = args && args['mode'] === 'production';

  const config = {
    entry: {
      main: path.resolve('./src/main.js'),
    },
    output: {
      path: path.resolve('./dist'),
    },

    target: 'web',

    devtool: isProduction ? false : 'source-map',

    resolve: {
      extensions: ['.js'],
      alias: {
        plugins: path.resolve(__dirname, 'src/plugins/'),
        utils: path.resolve(__dirname, 'src/utils/'),
      },
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          // eslint
          enforce: 'pre',
          use: [
            {
              options: {
                eslintPath: require.resolve('eslint'),
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(svg|jpg|jpeg|png|gif)$/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },

    watchOptions: {
      aggregateTimeout: 100,
      ignored: /node_modules/,
      poll: 300,
    },

    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      contentBase: './dist',
      publicPath: '/',
      compress: false,
      port: 8000,
      historyApiFallback: true,
      hot: true,
      open: true,
      inline: true,
      stats: 'normal',
      clientLogLevel: 'error',
    },

    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: isProduction ? 'production' : 'development',
        DEBUG: !isProduction,
      }),
      new MiniCssExtractPlugin({
        filename: configuration.cssOutput.filename,
        chunkFilename: configuration.cssOutput.chunkFilename,
      }),
      new CopyWebpackPlugin({
        patterns: [
          // static files to the site root folder (index and robots)
          {
            from: '**/*',
            to: path.resolve('./dist/'),
            context: './public/',
          },
        ],
      }),
    ],
  };

  return config;
};
