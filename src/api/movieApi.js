import request from "@/plugins/request.js";
import store from "@/store/index.js";
const api = store.state.movie.api;

export const getDataList = (params) =>
  request.get(api + "api/common/getDataList", { params });

export const getVideoHtmlbyAQY = (params) =>
  request.get(api + "api/common/getVideoHtmlbyAQY", { params });

// 首页热门
export const getMovieIndex = () =>
  request.get(api + "api/common/getMovieIndex");

export const getUrlSourse = (params) =>
  request.get(api + "api/common/getUrlSourse", { params });
