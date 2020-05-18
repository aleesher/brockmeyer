const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MomentTimezoneDataPlugin = require("moment-timezone-data-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: path.join(__dirname, "portal", "index.tsx"),
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".scss"],
    alias: {
      components: path.resolve(__dirname, "portal/components/"),
      models: path.resolve(__dirname, "portal/models/"),
      helpers: path.resolve(__dirname, "portal/helpers/"),
      constants: path.resolve(__dirname, "portal/constants/")
    }
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["portal/styles"]
              }
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000"
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: "url-loader"
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    proxy: {
      "/auth": "http://localhost:3001",
      "/login": "http://localhost:3001",
      "/logout": "http://localhost:3001",
      "/api": "http://localhost:3001"
    },
    historyApiFallback: true,
    disableHostCheck: true
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MomentTimezoneDataPlugin({
      matchZones: "Europe/Amsterdam"
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./public/index.html"
    }),
    new CopyWebpackPlugin([{ from: "public/assets", to: "assets" }]),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new Dotenv({
      path: process.env.ENV_FILE || "./.env"
    })
  ]
};
