import request from "@/plugins/request.js";
import store from "@/store/index.js";
const api = store.state.movie.api;

// 获取查询的视频结果
export const getDataList = (params) =>
  request.get(api + "api/video/getDataList", { params });

// 对源路径进行处理
export const getVideoHtmlbyAQY = (params) =>
  request.get(api + "api/video/getVideoHtmlbyAQY", { params });

// 首页热门
export const getMovieIndex = () => request.get(api + "api/video/getMovieIndex");

// 获取解析后的播放src
export const getUrlSourse = (params) =>
  request.get(api + "api/video/getUrlSourse", { params });
