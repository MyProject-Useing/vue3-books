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

export function isMobileDevice() {
  //判断当前设备是否为移动端
  const ua = navigator.userAgent.toLowerCase();
  const t1 =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const t2 = !ua.match("iphone") && navigator.maxTouchPoints > 1;
  return t1 || t2;
}
export function isMobilePhone() {
  //判断当前设备是手机
  const ua = navigator.userAgent.toLowerCase();
  const t1 = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
    ua
  );
  // const t2 = !ua.match("iphone") && navigator.maxTouchPoints > 1;
  return t1;
}
export function isIOS() {
  // const ua = navigator.userAgent;
  // return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  var u = window.navigator.userAgent;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
  return !isAndroid;
}

// 判断是否为移动端
export function isBobile() {
  let isTrue = isMobileDevice() || isMobilePhone();
  return isTrue;
}
