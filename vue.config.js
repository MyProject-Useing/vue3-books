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
