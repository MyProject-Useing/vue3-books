import request from "@/plugins/request.js";
import store from "@/store/index.js";
const api = store.state.book.api;
export const getDataList = (params) =>
  request.post(api + "api/common/searchBooksList", params);

export const getBooksText = (params) =>
  request.post(api + "api/common/getBooksText", params);

export const getCatalog = (params) =>
  request.post(api + "api/common/getCatalog", params);
