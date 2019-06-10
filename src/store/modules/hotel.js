import { HOTEL } from "@/store/mutation-types";
const state = {
  text: 1,
  cityoption: [], //城市列表
  commitCityArea: [], //城市区域列表
  brandList:[],    //品牌列表
  allHotelList:[]
};
const getters = {
  //getters能取到全局state  getters:所有getters方法 rootState:全局state
  textpath(state, getters, rootState) {
    return state.text + "使用了全局state" + rootState.author;
  },
  getbrandoption(state) {
    var returbrand=JSON.parse(JSON.stringify(state.brandList));
    for (var i = 0; i < returbrand.length; i++) {
      delete returbrand[i]['icon'];
      delete returbrand[i]['brandDetail'];
      delete returbrand[i]['brandRemark'];
    }
    return returbrand;
  }
};
const mutations = {
  //state是hotel模块里面的state
  updateText(state, text) {
    console.log("hotel.state", state);
    state.text = text;
  },
  [HOTEL.COMMIT_BRANDLIST](state,option){
    state.brandList = option;
  },
  [HOTEL.COMMIT_CITYOPTION](state, option) {
    state.cityoption = option;
  },
  [HOTEL.COMMIT_CITYAREA](state, option) {
    state.commitCityArea = option;
  },
  [HOTEL.COMMIT_ALLHOTEL](state,option){
    state.allHotelList = option;
  }
};
const actions = {
  //不加{root:true}自动在这个模块声明的mutations里面找
  add({ state, commit, rootState }) {
    commit("updateText", rootState.count);
  }
};

export default {
  namespaced: true, //不与全局mutations冲突,可在不同模块写同名mutations例如updateText()
  state,
  getters,
  mutations,
  actions
};
