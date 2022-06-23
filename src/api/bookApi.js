import request from "@/plugins/request.js";
import store from "@/store/index.js";

const api = store.state.book.api;
export const getDataList = (params) =>
  request.get(api + "api/book/getBooksList", { params });

export const getVipContent = (params) =>
  request.get(api + "api/book/getVipContent", { params });

// 首页热门
export const getBookIndex = () => request.get(api + "api/book/getBookIndex");

// 获取书籍信息/目录
export const getBookInfo = (params) =>
  request.get(api + "api/book/getBookInfo", { params });

// 获取免费小说
export const getFreeContent = (params) =>
  request.get(api + "api/book/getFreeContent", { params });
