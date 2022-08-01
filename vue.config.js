const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");

// var { showDebugger } = require("./src/plugins/safe");
// if (process.env.NODE_ENV === "production") {
//   showDebugger();
// }

// const setting = require("./src/setting.js");
module.exports = defineConfig({
  publicPath: "./", // 设置打包路径
  transpileDependencies: true,
  //去除vue打包后js目录下生成的.map文件，用于加速生产环境构建
  productionSourceMap: false,
  // 修改或新增html-webpack-plugin的值，在index.html里面能读取htmlWebpackPlugin.options.title
  // chainWebpack: (config) => {
  //   config.plugin("html").tap((args) => {
  //     args[0].title = setting.title;
  //     return args;
  //   });
  // },
  // 该对象将会被 webpack-merge 合并入最终的 webpack 配置。
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.plugins.push(
        new CompressionPlugin({
          // gzip压缩配置
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10kb的数据进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        })
      );
    } else {
      // 为开发环境修改配置...
    }
  },
  devServer: {
    // proxy: {},
    // 此处开启 https
    // https: true,
  },
  // build: {},
});
