import { ROOM } from "@/store/mutation-types";
const state = {
  allBedOption: [] //床型信息
};
const getters = {
  getbedoption(state) {
    var returnbed = [];
    var bedtype = { value: "", label: "", children: [] };
    for (var i = 0; i < state.allBedOption.length; i++) {
      bedtype.value = i;
      bedtype.label = state.allBedOption[i].bedType;
      for (var j = 0; j < state.allBedOption[i].beds.length; j++) {
        bedtype.children.push({
          value: state.allBedOption[i].beds[j].id,
          label: state.allBedOption[i].beds[j].bedName
        });
      }
      returnbed.push(bedtype);
      bedtype = { value: "", label: "", children: [] };
    }
    return returnbed;
  },
  getalllbedinfo(state) {
    var returnbed = [];
    for (var i = 0; i < state.allBedOption.length; i++) {
      for (var j = 0; j < state.allBedOption[i].beds.length; j++) {
        returnbed[state.allBedOption[i].beds[j].id] =
          state.allBedOption[i].beds[j].bedName;
      }
    }
    return returnbed;
  }
};
const mutations = {
  //state是hotel模块里面的state
  [ROOM.COMMIT_ALLBEDINDO](state, option) {
    state.allBedOption = [];
    state.allBedOption = option;
  }
};
const actions = {
  //不加{root:true}自动在这个模块声明的mutations里面找
};

export default {
  namespaced: true, //不与全局mutations冲突,可在不同模块写同名mutations例如updateText()
  state,
  getters,
  mutations,
  actions
};
