import { Message } from "element-ui";
export const messages = function(type, message) {
  Message({
    type: type,
    message: message
  });
};
//返回yyyy-mm-dd hh:ss:mm
export function formatdatetime(fmt, time) {
  fmt = new Date(fmt);
  var year = fmt.getFullYear() + "年";
  var month = fmt.getMonth() + 1 + "月";
  var date = fmt.getDate() + "日";
  return [year, month, date].join("-") + time;
}

//得到yyyy-mm-dd
export function formatdate(fmt) {
  fmt = new Date(fmt);
  var year = fmt.getFullYear();
  var month = (fmt.getMonth() + 1)+'';
  var date = fmt.getDate()+'';
  month=month.padStart(2,"0");
  date=date.padStart(2,"0");
  return [year, month, date].join("-");
}

//得到hh:ss:mm
export function formattime(t) {
  if (t.indexOf("T") != -1) {
    var y, h; //年份,时间
    var regH = /(T| )(\d\d:\d\d:\d\d)(\.\d+)?/; // 校验时间格式
    h = t.match(regH);
    h = h && h[2]; //拿到时分秒
    y = t.slice(0, t.indexOf("T")); //截取年月日
    var timearray = new Array();
    timearray.push(y);
    timearray.push(h);
    return h;
  } else {
    return "00:00:00";
  }
}
export function subString(str, len, hasDot) {
  var newLength = 0;
  var newStr = "";
  var chineseRegex = /[^\x00-\xff]/g;
  var singleChar = "";
  var strLength = str.replace(chineseRegex, "**").length;
  for (var i = 0; i < strLength; i++) {
    singleChar = str.charAt(i).toString();
    if (singleChar.match(chineseRegex) != null) {
      newLength += 2;
    } else {
      newLength++;
    }
    if (newLength > len) {
      break;
    }
    newStr += singleChar;
  }

  if (hasDot && strLength > len) {
    newStr += "...";
  }
  return newStr;
}
export function listAssign(arrA, arrB) {
  return Object.keys(arrA).forEach(key => {
    arrA[key] = arrB[key] || arrA[key];
  });
}
