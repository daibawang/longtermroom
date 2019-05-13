/**
 * 拿到数据，更改状态 只能接受2个参数  this.$store.commit("xx") 赋值
 */
// import { myRouter } from "@/router/router";
import { setCookie } from "@/assets/js/cookie.js";
import { FATHER } from "./mutation-types";
const mutations = {
  [FATHER.COMMIT_TOKEN](state, token) {
    state.token = token;
  },
  [FATHER.COMMIT_INFO](state, user) {
    state.userInfo = user;
  },
  [FATHER.REMOVE_TOKEN](state) {
    state.token = "";
    localStorage.removeItem("token");
    setCookie("jwt", "", 1000 * 60);
  },
  [FATHER.COMMIT_SECONDROUTER](state, router) {
    state.secondrouter = router;
  }
  //保存用户
  // COMMIT_ROLE(state, roles) {
  //   state.roles = roles;
  // },
};
export default mutations;
