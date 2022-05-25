import request from "@/plugins/request.js";
import store from "@/store/index.js";
const api = store.state.movie.api;

export const getDataList = (params) =>
  request.post(api + "api/common/getDataList", params);

export const getVideo = (params) =>
  request.post(api + "api/common/getVideo?url=", params);

export const getVideoList = (url) =>
  // 完整的地址 https://a1.m1907.cn/api/v/
  // https 需要做代理 不然会报跨站问题
  request.get(
    "https://a1.m1907.cn/api/v?z=02268e51de6c56b0da64d31ca1928446&s1ig=11400&jx=" +
      url +
      "&g="
  );
