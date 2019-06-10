import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/public.css";
import global_ from "./components/tools/Global";
Vue.prototype.$URL = process.env.API_ROOT;
Vue.prototype.GLOBAL = global_;
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: createElement => createElement(App)
}).$mount("#app");
