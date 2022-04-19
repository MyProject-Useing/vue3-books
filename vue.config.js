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
  // assetsDir: "static",
  // productionSourceMap: false,
  // integrity: true,
  // crossorigin: undefined,
  // chainWebpack: (config) => {
  //   config.resolve.symlinks(true); // 修复热更新失效
  //   // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
  //   config.plugin("html").tap((args) => {
  //     // 修复 Lazy loading routes Error
  //     args[0].chunksSortMode = "none";
  //     return args;
  //   });
  //   config.resolve.alias // 添加别名
  //     .set("@", resolve("src"))
  //     .set("@assets", resolve("src/assets"))
  //     .set("@components", resolve("src/components"))
  //     .set("@views", resolve("src/views"))
  //     .set("@store", resolve("src/store"));
  //   // 压缩图片
  //   // 需要 npm i -D image-webpack-loader
  //   config.module
  //     .rule("images")
  //     .use("image-webpack-loader")
  //     .loader("image-webpack-loader")
  //     .options({
  //       mozjpeg: { progressive: true, quality: 65 },
  //       optipng: { enabled: false },
  //       pngquant: { quality: [0.65, 0.9], speed: 4 },
  //       gifsicle: { interlaced: false },
  //       webp: { quality: 75 },
  //     });
  // },
});
