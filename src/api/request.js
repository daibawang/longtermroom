import axios from "axios";
import router from "../router/router";
import { Loading } from "element-ui";
import { messages } from "../assets/js/common.js"; //封装的提示文件
import store from "../store/store"; //引入vuex
import Qs from "qs";
axios.defaults.timeout = 60000; //设置接口超时时间
axios.defaults.baseURL = process.env.BASE_URL; //根据环境设置基础路径
// axios.defaults.baseURL = '/apis/'; //根据环境设置基础路径
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8"; //设置编码
// axios.defaults.headers.post["Content-Type"] =
//   "application/json"; //设置编码
axios.defaults.headers.put["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
let loading = null; //初始化loading

/*请求前拦截
 *用于处理需要请求前的操作
 */
axios.interceptors.request.use(
  config => {
    loading = Loading.service({
      text: "正在加载中......",
      fullscreen: true
    });
    if (store.state.token) {
      config.headers["Authorization"] = "Bearer " + store.state.token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/*
 *请求响应拦截
 *用于处理数据返回后的操作
 */
axios.interceptors.response.use(
  response => {
    return new Promise((resolve, reject) => {
      //请求成功后关闭加载框
      if (loading) {
        loading.close();
      }
      const res = response.data;
      if (res != null) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  },
  error => {
    console.log(error);
    //请求成功后关闭加载框
    if (loading) {
      loading.close();
    }
    //断网处理或者请求超时
    if (!error.response) {
      //请求超时
      if (error.message.includes("timeout")) {
        console.log("超时了");
        messages("error", "请求超时，请检查互联网连接");
      } else {
        //断网，可以展示断网组件
        console.log("断网了");
        messages("error", "请检查网络是否已连接");
      }
      return;
    }
    const status = error.response.status;
    switch (status) {
      case 500:
        messages("error", "服务器内部错误");
        break;
      case 404:
        messages("error", "未找到远程服务器");
        break;
      case 401:
        messages("warning", "请重新登陆");
        setTimeout(() => {
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
        }, 1000);
        break;
      case 400:
        messages("error", "数据异常，详情请咨询");
        break;
      default:
        messages("error", error.response.data.message);
    }
    return Promise.reject(error);
  }
);

//封装get,post,put,delete请求
/*
 *get方法，对应get请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    //给get请求加上时间戳参数，避免从缓存中拿数据
    if (params !== undefined) {
      Object.assign(params, { _t: new Date().getTime() });
    } else {
      params = { _t: new Date().getTime() };
    }
    axios
      .get(url, {
        params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/*
 *post方法，对应post请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function post(url, params) {
  var data = Qs.stringify(params);
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/*
 *post_json方法
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function post_json(url, params) {
  // var data = Qs.stringify(params,{arrayFormat: 'repeat'});
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/*
 *post_jsonheader方法，对应application/json请求头
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
// export function post_jsonheader(url,params ) {
//   // var data = Qs.stringify(params,{arrayFormat: 'repeat'});
//   return new Promise((resolve, reject) => {
//     axios
//       .post(url, params)
//       .headers("application/json")
//       .then(res => {
//         resolve(res);
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });
// }
/*
 *put方法，对应put请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function put(url, params) {
  var data = Qs.stringify(params);
  return new Promise((resolve, reject) => {
    axios
      .put(url, data)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/*
 *put_json方法，对应put请求,使用application/json请求头
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function put_json(url, params) {
  // var data = Qs.stringify(params);
  axios.create({
    headers: { "Content-Type": "application/json" }
  });
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/*
 *delete方法，对应delete请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function _delete(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, { params: params })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function _delete_stringfty(url, params) {
  return new Promise((resolve, reject) => {
    console.log(params);
    // var data = Qs.stringify(params);
    axios
      .delete(url, { params: params })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
