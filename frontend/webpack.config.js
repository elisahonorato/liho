const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
        {
            test: path.join(__dirname, '.'),
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env',
                          '@babel/react',{
                          'plugins': ['@babel/plugin-proposal-class-properties']}]
            }
        }
    ]
},
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};