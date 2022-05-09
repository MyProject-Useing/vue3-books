export function format(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
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
