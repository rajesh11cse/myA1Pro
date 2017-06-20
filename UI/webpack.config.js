var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
    entry: "./main.js",
    output: {
        path: "./",
        filename: "app.bundle.js",
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    },
    module: {
        loaders: [
          {
            test: /\.js?$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,                    
                presets: ["es2015", "react", "stage-0"],
                plugins: ["react-html-attrs", "transform-class-properties", "transform-decorators-legacy"]
            }
          },
        ]
    },
    plugins: [
         new webpack.DefinePlugin({
             "process.env":{
                 "NODE_ENV": JSON.stringify("production")
             }
         }),
         new webpack.optimize.UglifyJsPlugin({
             beautify: false,
             mangle: {
                 screw_ie8: true,
                 keep_fnames: true
             },
             compress: {
                 warnings: true,
                 screw_ie8: true
             },
             comments: false
         }),
     ],
}

module.exports = config;
