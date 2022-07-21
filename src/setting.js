// 系统类型
const { sysTypeList } = require("./plugins/map.js");

// 是否为发布环境
const isPro = process.env.NODE_ENV === "production";

module.exports = {
  title: "蛋花-综合网站",

  // 设置系统入口类型
  entry: sysTypeList[0],

  // 模式
  mode: "",

  // 书籍配置
  book: {
    api: isPro ? "http://111.229.92.181:3003/" : "http://localhost:3003/",
    // api: "http://111.229.92.181:3003/",
  },

  // 视频配置
  video: {
    api: isPro ? "http://111.229.92.181:3003/" : "http://localhost:3003/",
    // api: "http://111.229.92.181:3003/",
  },
};

// 漫画解析地址
// http://www.766kan.com/list/index4.html

// 盗版地址
// https://www.iimanhua.cc/comic/28936/793577.html
//https://www.iimanhua.cc/comic/45400/829094.html
// 解析地址
//http://www.nikucms.com/
// 解析集合
// http://jiexi.nikucms.com/
