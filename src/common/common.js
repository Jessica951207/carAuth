// 格式化时间
export const dateFormat = (dateStr, fmt = 'yyyy-MM-dd hh:mm') => {
    if (!dateStr) return
    let date = new Date(dateStr)
  console.log(date)
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
  // 除
  export const Div = (arg1 = 0, arg2 = 100) => {
    let r1 = arg1.toString()
    let r2 = arg2.toString()
    let m, resultVal
    let d = arguments[2]
    m = (r2.split('.')[1] ? r2.split('.')[1].length : 0) - (r1.split('.')[1] ? r1.split('.')[1].length : 0)
    resultVal = Number(r1.replace('.', '')) / Number(r2.replace('.', '')) * Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  }
  
  /**
   * 计算年份->计算月份->计算天数
   */
  export const getDiffYmdBetweenDate = (sDate1,sDate2) => {
    var fixDate = function(sDate){
        var aD = sDate.split('-');
        for(var i = 0; i < aD.length; i++){
            aD[i] = fixZero(parseInt(aD[i]));
        }
        return aD.join('-');
    };
    var fixZero = function(n){
        return n < 10 ? '0'+n : n;
    };
    var fixInt = function(a){
        for(var i = 0; i < a.length; i++){
            a[i] = parseInt(a[i]);
        }
        return a;
    };
    var getMonthDays = function(y,m){
        var aMonthDays = [0,31,28,31,30,31,30,31,31,30,31,30,31];
        if((y%400 == 0) || (y%4==0 && y%100!=0)){
            aMonthDays[2] = 29;
        }
        return aMonthDays[m];
    };
    var checkDate = function(sDate){
    };
    var y = 0;
    var m = 0;
    var d = 0;
    var sTmp;
    var aTmp;
    sDate1 = fixDate(sDate1);
    sDate2 = fixDate(sDate2);
    if(sDate1 > sDate2){
        sTmp = sDate2;
        sDate2 = sDate1;
        sDate1 = sTmp;
    }
    var aDate1 = sDate1.split('-');
        aDate1 = fixInt(aDate1);
    var aDate2 = sDate2.split('-');
        aDate2 = fixInt(aDate2);
    //计算相差的年份
    /*aTmp = [aDate1[0]+1,fixZero(aDate1[1]),fixZero(aDate1[2])];
    while(aTmp.join('-') <= sDate2){
        y++;
        aTmp[0]++;
    }*/
    y = aDate2[0] - aDate1[0];
    if( sDate2.replace(aDate2[0],'') < sDate1.replace(aDate1[0],'')){
        y = y - 1;
    }
    //计算月份
    aTmp = [aDate1[0]+y,aDate1[1],fixZero(aDate1[2])];
    while(true){
        if(aTmp[1] == 12){
            aTmp[0]++;
            aTmp[1] = 1;
        }else{
            aTmp[1]++;
        }
        if(([aTmp[0],fixZero(aTmp[1]),aTmp[2]]).join('-') <= sDate2){
            m++;
        } else {
            break;
        }
    }
    //计算天数
    aTmp = [aDate1[0]+y,aDate1[1]+m,aDate1[2]];
    if(aTmp[1] > 12){
        aTmp[0]++;
        aTmp[1] -= 12;
    }
    while(true){
        if(aTmp[2] == getMonthDays(aTmp[0],aTmp[1])){
            aTmp[1]++;
            aTmp[2] = 1;
        } else {
            aTmp[2]++;
        }
        sTmp = ([aTmp[0],fixZero(aTmp[1]),fixZero(aTmp[2])]).join('-');
        if(sTmp <= sDate2){
            d++;
        } else {
            break;
        }
    }
    return {y:y,m:m,d:d};
  }
  
  /**
   * 计算年份->计算月份->计算天数
   */
  export const getDiffYmdBetweenDateStyle = (sDate1,sDate2) => {
  
      let { y, m, d } = getDiffYmdBetweenDate(sDate1, sDate2)
  
      var day = d >= 30 ? d : d+1;
      var month = m;
      var year = y;
      
      // 计算天数
      if (day >= 30) {
          if (day === 31) {
              day = 1;
          }else {
              day = 0;
          }
          month +=1;
      }else {
          day = day;
      }
      // 计算月份
      if (month >= 12) {
          if (month === 13) {
              month = 1;
          }else {
              month = 0;
          }
          year +=1;
      }else {
          month = month;
      }
      return {year:year,month:month,day:day};
      
  }
// 截取第一个？后链接后面的参数
export const getUrlParamFirst = (key) =>{
  var url = window.location.href; //获取当前url
  console.log(url);
  var cs = url.split("?")[1]; //获取?之后的参数字符串
  console.log(cs);
  var cs_arr = cs.split("&"); //参数字符串分割为数组
  console.log(cs_arr);
  var cs = {};
  for (var i = 0; i < cs_arr.length; i++) {
    //遍历数组，拿到json对象
    cs[cs_arr[i].split("=")[0]] = cs_arr[i].split("=")[1];
  }
  return cs[key];
}

//截取第一个链接全部参数
  export const getUrlParam = () =>{
  var url = window.location.href; //获取当前url
  console.log(url);
  var cs = url.split("?")[1]; //获取?之后的参数字符串
  console.log(cs);
  var cs_arr = cs.split("&"); //参数字符串分割为数组
  console.log(cs_arr);
  var cs = {};
  for (var i = 0; i < cs_arr.length; i++) {
    //遍历数组，拿到json对象
    cs[cs_arr[i].split("=")[0]] = cs_arr[i].split("=")[1];
  }
  return cs;
}

  //截取链接第二个问号后面的参数
  export const getUrlParamSec = (name) => {
    var url = window.location.href; //获取当前url
    var second = url.split("?")[2];
    console.log("second is:",second);
    var secArray = second.split("&"); //参数字符串分割为数组
    console.log('secArray',secArray)
    var sec={};
    secArray.map(function (cur,index) {
      sec[cur.split("=")[0]] = cur.split("=")[1]
    })
    return sec[name];
}

// 判断当前终端是移动端（iOS、Android、塞班、Windows Phone、iPad、iPod）还是PC  false=>PC
export const isPhone = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
//h获取设备
export function GetOs () {
  let sUserAgent = navigator.userAgent.toLocaleLowerCase()
  let isWin = (navigator.platform === 'win32') || (navigator.platform === 'windows')
  let isMac = (navigator.platform === 'mac68k') || (navigator.platform === 'macppc') || (navigator.platform === 'macintosh') || (navigator.platform === 'macintel')
  if (isMac) return 'Mac'
  var isUnix = (navigator.platform === 'x11') && !isWin && !isMac
  if (isUnix) return 'Unix'
  var isLinux = (String(navigator.platform).indexOf('linux') > -1)
  if (isLinux) return 'Linux'
  if (isWin) {
    var isWin2K = sUserAgent.indexOf('windows nt 5.0') > -1 || sUserAgent.indexOf('windows 2000') > -1
    if (isWin2K) return 'Win2000'
    var isWinXP = sUserAgent.indexOf('windows nt 5.1') > -1 || sUserAgent.indexOf('windows xp') > -1
    if (isWinXP) return 'WinXP'
    var isWin2003 = sUserAgent.indexOf('windows nt 5.2') > -1 || sUserAgent.indexOf('windows 2003') > -1
    if (isWin2003) return 'Win2003'
    var isWinVista = sUserAgent.indexOf('windows nt 6.0') > -1 || sUserAgent.indexOf('windows vista') > -1
    if (isWinVista) return 'WinVista'
    var isWin7 = sUserAgent.indexOf('windows nt 6.1') > -1 || sUserAgent.indexOf('windows 7') > -1
    if (isWin7) return 'Win7'
  }
  if (sUserAgent.indexOf('android') > -1) return 'Android'
  if (sUserAgent.indexOf('iphone') > -1) return 'iPhone'
  if (sUserAgent.indexOf('symbianos') > -1) return 'SymbianOS'
  if (sUserAgent.indexOf('windows phone') > -1) return 'Windows Phone'
  if (sUserAgent.indexOf('ipad') > -1) return 'iPad'
  if (sUserAgent.indexOf('ipod') > -1) return 'iPod'
  return 'others'
}
