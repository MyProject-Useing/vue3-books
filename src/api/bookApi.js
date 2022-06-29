import request from "@/plugins/request.js";
import store from "@/store/index.js";

const api = store.state.book.api;

// 首页热门
export const getBookIndex = () => request.get(api + "api/book/getBookIndex");

// 获取查询的视频结果
export const getDataList = (params) =>
  request.get(api + "api/book/getDataList", { params });

// 获取书籍信息/目录
export const getBookInfo = (params) =>
  request.get(api + "api/book/getBookInfo", { params });

// 获取免费小说
export const getFreeContent = (params) =>
  request.get(api + "api/book/getFreeContent", { params });

// 获取VIP小说
export const getVipContent = (params) =>
  request.get(api + "api/book/getVipContent", { params });
