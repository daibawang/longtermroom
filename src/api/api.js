//分装请求接口
import { get, post, put, _delete } from "./request";
//登陆
export const login = login => post("api/auth/login", login);
//上传
// export const  upload=(upload)=>get('/api/get/upload',upload)
//酒店模块
//城市区域管理
export const selectAllCities = nodata =>
  get("cityAndArea/selectAllCities", nodata);
