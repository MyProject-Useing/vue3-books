"use strict";

import Axios from "axios";
import { message, ElMessageBox } from "ant-design-vue";
import { errorTypeList } from "./config";
import store from "@/store";

const service = Axios.create({
  baseURL: store.state.api,
  withCredentials: true,
  timeout: 5 * 60 * 1000,
});

service.interceptors.request.use(
  (config) => config,
  (error) => {
    // console.log(error); // for debug
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
  params.accessToken = store.state.token;
  if (store.state.isManagerMode && store.state.secureKey) {
    params.secureKey = store.state.secureKey;
    params.userNS = store.state.userNS;
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
    if (params.bookSourceUrl && store.state.failureIncludeTimeout) {
      // 判断是否失效书源
      const errorMsg = e.toString();
      window.errorMsgList = window.errorMsgList || [];
      window.errorMsgList.push(errorMsg);
      if (errorMsg.indexOf("timeout") >= 0) {
        store.commit("addFailureBookSource", {
          bookSourceUrl: params.bookSourceUrl,
          errorMsg,
        });
      }
    }
    throw e;
  });
  if (!response) {
    return;
  }
  const res = response.data;

  const { isSuccess, errorMsg } = res;
  if (!isSuccess) {
    switch (res.data) {
      case "NEED_LOGIN":
        // 需要登录
        break;
      default:
        if (params.bookSourceUrl) {
          // 判断是否失效书源
          if (errorMsg) {
            window.errorMsgList = window.errorMsgList || [];
            window.errorMsgList.push(errorMsg);
            for (let index = 0; index < errorTypeList.length; index++) {
              if (errorMsg.indexOf(errorTypeList[index]) >= 0) {
                store.commit("addFailureBookSource", {
                  bookSourceUrl: params.bookSourceUrl,
                  errorMsg,
                });
                break;
              }
            }
          }
        }
        if (!options.silent) {
          errorMsg && message.error(errorMsg);
        }
        break;
    }
  } else {
    alert &&
      errorMsg &&
      message.success(errorMsg);
  }

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
