const path = require("path");

module.exports = {
  entry: "./src/renderer/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "src/renderer"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "src/renderer"),
      publicPath: "/",
    },
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true,
  },
};
