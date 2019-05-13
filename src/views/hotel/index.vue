<template>
  <HeaderSecond></HeaderSecond>
</template>
<script>
import HeaderSecond from "@/components/HeaderSecond.vue";
import routes from "@/router/router";
import { mapMutations } from "vuex";
export default {
  name: "hotel",
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
      header => header.path == "/hotel"
    );
    this.$store.commit("commitSecondRouter", headerroot);
  },
  methods: {}
};
</script>
