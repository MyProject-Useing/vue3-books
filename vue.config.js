const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 修改或新增html-webpack-plugin的值，在index.html里面能读取htmlWebpackPlugin.options.title
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "yy-综合网站";
      return args;
    });
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
