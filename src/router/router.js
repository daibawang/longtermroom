import Vue from "vue";
import Router from "vue-router";
import store from "../store/store"; //引入状态管理
import NProgress from "nprogress"; //引入进度条组件 cnpm install nprogress --save
import "nprogress/nprogress.css";
import Home from "../views/Home";

Vue.use(Router);
// 路由懒加载
const getComponent = (name, component) => () =>
  import(`@/views/${name}/${component}.vue`);
const getRootComponent = component => () => import(`@/views/${component}.vue`);
const myRouter = new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: getComponent("login", "index")
    },
    {
      path: "/",
      name: "home",
      component: getRootComponent("Home"),
      redirect: { name: "Order" },
      meta: { title: "主页" },
      children: [
        {
          path: "/hotel",
          name: "Hotel",
          component: () => import("@/views/hotel/index"),
          redirect: "/hotel/hotelList",
          meta: { title: "酒店" },
          children: [
            {
              path: "hotelList",
              component: () => import("@/views/hotel/hotelList/index"), // Parent router-view
              name: "hotelList",
              meta: { title: "酒店管理" }
            },
            {
              path: "hotelBrand",
              component: () => import("@/views/hotel/hotelBrand/index"),
              name: "hotelBrand",
              meta: { title: "品牌管理" }
            },
            {
              path: "hotelCity",
              component: () => import("@/views/hotel/hotelCity/index"),
              name: "hotelCity",
              meta: { title: "区域管理" }
            }
          ]
        },
        {
          path: "/house",
          name: "House",
          component: () => import("@/views/house/index"),
          redirect: "/house/houseList",
          meta: { title: "房型" },
          children: [
            {
              path: "houseList",
              component: () => import("@/views/house/houseList/index"), // Parent router-view
              name: "houseList",
              meta: { title: "售卖管理" }
            },
            {
              path: "houseRoom",
              component: () => import("@/views/house/houseRoom/index"), // Parent router-view
              name: "houseRoom",
              meta: { title: "房型管理" }
            }
          ]
        },
        {
          path: "/order",
          name: "Order",
          component: () => import("@/views/order/index"),
          redirect: "/order/orderList",
          meta: { title: "订单" },
          children: [
            {
              path: "orderList",
              component: () => import("@/views/order/orderList/index"), // Parent router-view
              name: "orderList",
              meta: { title: "订单管理" }
            }
          ]
        },
        {
          path: "/other",
          name: "Other",
          component: () => import("@/views/other/index"),
          redirect: "/other/otherBanner",
          meta: { title: "其他" },
          children: [
            {
              path: "otherBanner",
              component: () => import("@/views/other/otherBanner/index"), // Parent router-view
              name: "otherBanner",
              meta: { title: "活动管理" }
            }
          ]
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
      path: "/403",
      component: getComponent("error", "403")
    },
    {
      path: "/404",
      component: getComponent("error", "404")
    },
    {
      path: "*",
      redirect: "/404"
    }
  ]
});
// 判断是否存在token
myRouter.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.path !== "/login" && !store.state.token) {
    next("/login");
    NProgress.done(); // 结束Progress
  } else {
    next();
  }
  // if(to.meta.roles){
  //   to.meta.roles.includes(...store.getters.roles)?next():next('/404')
  // }else{
  //   next();
  // }
});

myRouter.afterEach(() => {
  NProgress.done(); // 结束Progress
});
export default myRouter;

// Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiYWRtaW4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTU1OTA1OTk4OCwiZXhwIjoxNTU5NjY0Nzg4fQ.Lf0a4djjUz79AnuzIGFQ1Sc8nukB6m1XSuWWI4cm-p2t-W0jw5S7DltM0NKNWtIEgOQgi6IY8DFBGUp20uQx6A
