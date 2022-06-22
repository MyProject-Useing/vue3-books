import request from "@/plugins/request.js";
import store from "@/store/index.js";

const api = store.state.book.api;
export const getDataList = (params) =>
  request.get(api + "api/book/getBooksList", { params });

export const getBooksText = (params) =>
  request.get(api + "api/book/getBooksText", { params });

export const getCatalog = (params) =>
  request.get(api + "api/book/getCatalog", { params });

// 获取书籍信息/目录
export const getBookInfo = (params) =>
  request.get(api + "api/book/getBookInfo", { params });

// 首页热门
export const getBookIndex = () => request.get(api + "api/book/getBookIndex");
