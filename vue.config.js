const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");
const setting = require("./src/setting.js");
module.exports = defineConfig({
  publicPath: "./", // 设置打包路径
  transpileDependencies: true,
  // 修改或新增html-webpack-plugin的值，在index.html里面能读取htmlWebpackPlugin.options.title
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = setting.title;
      return args;
    });
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        new CompressionPlugin({
          // gzip压缩配置
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10kb的数据进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        })
      );
    }
  },
  devServer: {
    // proxy: {
    // "/M3u8": {
    //   target: "https://api.nxflv.com",
    //   ws: true, //代理websocked
    //   changeOrigin: true, //虚拟的站点需要更管origin
    //   secure: true, //是否https接口
    //   pathRewrite: {
    //     "^/M3u8": "/Cache/M3u8",
    //   },
    // },
    // },
    // 此处开启 https
    https: true,
  },
});

// "postcss": {
//   "plugins": {
//     "autoprefixer": {
//       "overrideBrowserslist": [
//         "Android 4.1",
//         "iOS 7.1",
//         "Chrome > 31",
//         "ff > 31",
//         "ie >= 8"
//       ]
//     },
//     "postcss-pxtorem": {
//       "rootValue": 85,
//       "propList": [
//         "*"
//       ]
//     }
//   }
// }
