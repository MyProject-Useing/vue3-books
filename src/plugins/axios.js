"use strict";

import Axios from "axios";
import store from "@/store";

const service = Axios.create({
  baseURL: store.state.api,
  // withCredentials: true,
  timeout: 5 * 60 * 1000,
});

service.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const request = async ({
  url,
  method = "get",
  params = {},
  data = {},
  headers = {},
  options = {},
  alert,
}) => {
  // post 默认显示返回的信息
  if (alert === undefined) {
    alert = method === "post";
  }
  const query = {
    url,
    method,
    headers,
    params,
    data,
    ...options,
  };
  const response = await service(query).catch((e) => {
    throw e;
  });
  return response;
};

request.get = async (url, options) => {
  options = options || {};
  return await request({
    url,
    method: "get",
    params: options.params || {},
    options,
  });
};

request.post = async (url, data, options) => {
  return await request({
    url,
    data,
    method: "post",
    options,
  });
};

export default request;

// export default (app) => {
//   app.use(axios);
// };
