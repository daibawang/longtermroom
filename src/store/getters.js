const getters = {
  roles: state => {
    return state.roles;
  },
  authorName(state) {
    return state.author;
  },
  creatRouter(state) {
    return state.secondrouter.children;
  }
};
export default getters;

//方便拿到数据后做处理,做组装，生成一些展示可用数据。
