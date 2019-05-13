const state = {
  text: 1
};
const getters = {
  //getters能取到全局state  getters:所有getters方法 rootState:全局state
  textplus(state, getters, rootState) {
    return state.text + "使用了全局state" + rootState.author;
  }
};
const mutations = {
  //state是hotel模块里面的state
  updateText(state, text) {
    console.log("hotel.state", state);
    state.text = text;
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
