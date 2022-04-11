import noCover from "@/assets/imgs/noCover.jpeg";

import store from "@/store/index";

// import noImage from "./assets/imgs/noImage.png";

export function buildURL(path, params) {
  let arr = [];
  Object.keys(params).forEach((key) => {
    let value = params[key];
    if (value) {
      value = key + `=` + value;
      arr.push(value);
    }
  });
  return path + "?" + arr.join("&");
}

export function getImagePath(url) {
  if (
    url &&
    (url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("//"))
  ) {
    return store.state.api + "/cover?path=" + url;
  }
  return false;
}

export function getCover(coverUrl, normal) {
  coverUrl = getImagePath(coverUrl);
  if (coverUrl) {
    return normal ? coverUrl : { src: coverUrl, error: noCover };
  }
  return noCover;
}

export function dateFormat(t) {
  let time = new Date().getTime();
  let int = parseInt((time - t) / 1000);
  let str = "";

  if (int <= 30) {
    str = "刚刚";
  } else if (int < 60) {
    str = int + "秒前";
  } else if (int < 3600) {
    str = parseInt(int / 60) + "分钟前";
  } else if (int < 86400) {
    str = parseInt(int / 3600) + "小时前";
  } else if (int < 2592000) {
    str = parseInt(int / 86400) + "天前";
  } else if (int < 31536000) {
    str = parseInt(int / 2592000) + "月前";
  } else {
    str = parseInt(int / 31536000) + "年前";
  }
  return str;
}
