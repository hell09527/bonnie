'use strict';

const SERVERS = {};

SERVERS.IS_DEV = true;

SERVERS.BASEURL = 'https://www.bonnieclyde.cn/'; //正式服务器url
SERVERS.DEVURL = 'https://store-test.91xdb.com/';//测试服务器url


// 登录
SERVERS.LOGIN = {
    getWechatEncryptInfo: 'api.php?s=Login/getWechatEncryptInfo', //微信登录
}

/**
 * 初始化SERVERS数据(批量初始化接口)
 */
SERVERS.init = function (state=true) {
    this.IS_DEV=state; //开发测试模式
    let list=['BASEURL','init','interceptors','filterData','getBase'];

    for(let k1 in this){
        if(this[k1] instanceof Object && list.indexOf(k1) == -1){
            for(let k2 in this[k1]){
                this[k1][k2] = ajax(this[k1][k2]);  //this-->赋值于ajax；
            }
        }
    }

}

// 获取基础域名
SERVERS.getBase = function(){
    return SERVERS.IS_DEV?SERVERS.DEVURL:SERVERS.BASEURL;
}


// 默认请求拦截器(请求配置通用，只暴露请求与返回数据配置)
SERVERS.interceptors = {
    request: data => data,
    response: res => res.data,
    finally: () => {}
};


/**
 * 请求数据过滤
 * @param {object} data 请求数据
 * @param {array}  list 过滤列表(默认：undefined,null,'')
 */
SERVERS.filterData = function(data,list = [undefined,null,'']){
    let nObj = {};
    for(let key in data){
        if(list.indexOf(data[key]) == -1){
            nObj[key] = data[key];
        }
    }
    return nObj;
}

/**
 * 请求统一合并封装
 * @param {string} url 请求地址
 */
function ajax(url){
    //是否为开发模式
    let base = SERVERS.IS_DEV?SERVERS.DEVURL:SERVERS.BASEURL;
    return {
        url: url,
        // get: data => fetchData(base + url, data , "GET"),
        post: data => fetchData(base + url, data , "POST"),
        // upload: data => '待添加'
    }
}
/**
 * 默认promise请求
 * @param {string} url  请求地址
 * @param {object} data 请求数据
 * @param {string} method 请求方式
 */ 
function fetchData(url,data = {},method) {
    // 设置请求头
    let contentType = method == 'GET'?'application/json':'application/x-www-form-urlencoded;';
    // 请求拦截处理
    let interceptors = SERVERS.interceptors.request(data,url)
    // 请求数据过滤
    let filterData = SERVERS.filterData(interceptors);
    // 数据序列化
    let cdata = serilize(filterData);

    return new Promise((resolve,reject) => {
        wx.request({
            url: url,
            data: cdata,
            header: {
                'content-type': contentType
            },
            method: method,
            dataType: 'json',
            success: res => resolve(SERVERS.interceptors.response(res)),
            fail: e => reject(e),
            complete: SERVERS.interceptors.finally
        });
    })
}

/**
 * 序列化对象(~)
 * @param {object} obj 转换数据
 */
function serilize(obj){
    let query = '';
    let name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += serilize(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += serilize(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }
    return query.length ? query.substr(0, query.length - 1) : query;
}

module.exports = SERVERS;