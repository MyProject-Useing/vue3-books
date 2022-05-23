// 系统类型
const { sysTypeList } = require("./plugins/map.js");

module.exports = {
  title: "蛋花-综合网站",

  // 设置系统入口类型
  entry: sysTypeList[0],

  // 模式
  mode: "",

  // 书籍配置
  book: {
    api: "http://111.229.92.181:3000/",
  },

  // 视频配置
  video: {
    api: "http://localhost:3003/",
  },
};
