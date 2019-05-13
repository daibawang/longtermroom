import Vue from "vue";
import Vuex from "vuex";
import defaultstate from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import hotel from "./modules/hotel";
//引入vuex 数据持久化插件,将state中数据存储到localStorag中
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

//在开发环境中限制直接修改state
const isdev = process.env.NODE_ENV === "development";

export default new Vuex.Store({
  strict: isdev,
  state: defaultstate,
  mutations,
  actions,
  getters,
  modules: {
    hotel,
    order: {
      namespaced: true,
      state: {
        text: 2
      }
    }
  },
  plugins: [
    createPersistedState({
      // storage: window.sessionStorage,
      reducer(val) {
        return {
          // 指定需要持久化的state,只储存state中的token
          token: val.token,
          roles: val.roles
        };
      }
    })
  ]
});
