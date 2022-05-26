"use strict";

import Axios from "axios";
// import store from "@/store";
import { message } from "ant-design-vue";
const service = Axios.create({
  // baseURL: store.state.api,
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
    // 统一处理错误信息
    hanldError(error);
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

function hanldError(error) {
  let msg = "接口连接异常。";
  // if (
  //   error.message === "Network Error" &&
  //   error.request.status === 0 &&
  //   error.request.readyState === 4
  // ) {
  //   msg = `接口未授信，请信任<a href="${error.config.url}" style="text-decoration:underline;" target="_blank" >此链接</a> `;
  // }

  if (
    error.message === "Network Error" &&
    error.request.status === 0 &&
    error.request.readyState === 4
  ) {
    msg = `无法连接跨域资源，请联系管理员。 `;
  }

  if (error.name === "SyntaxError") {
    msg = "接口连接中断";
  }

  message.error(msg);
}

export default request;
