<template>
  <HeaderSecond></HeaderSecond>
</template>
<script>
import HeaderSecond from "@/components/HeaderSecond.vue";
import routes from "@/router/router";
import { mapMutations } from "vuex";
export default {
  name: "house",
  components: {
    HeaderSecond
  },
  data() {
    return {};
  },
  created: function() {
    // console.log(routes.options.routes);
    //生成路由
    var rootroutes = routes.options.routes.find(rout => rout.path == "/");
    var headerroot = rootroutes.children.find(
      header => header.path == "/order"
    );
    this.$store.commit("commitSecondRouter", headerroot);
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.Order-index-hender {
  width: 100%;
  height: 12px;
  background-color: #22313e;
}
</style>