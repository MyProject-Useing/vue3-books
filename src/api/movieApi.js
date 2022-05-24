import request from "@/plugins/request.js";
import store from "@/store/index.js";
const api = store.state.movie.api;

export const getDataList = (params) =>
  request.post(api + "api/common/getDataList", params);

export const getVideo = (params) =>
  request.post(api + "api/common/getVideo?url=", params);
