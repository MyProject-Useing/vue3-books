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
export function isMobile() {
  let isTrue = isMobileDevice() || isMobilePhone();
  return isTrue;
}
