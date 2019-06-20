<template>
  <div class="Home-main">
    <div class="Home-main-hender">
      <div class="Home-main-hender-container">
        <div class="hender-container-top">
          <div class="hender-container-top-icon">
            <div class="top-icon-bg1"></div>
            <div class="top-icon-bg1 bg2"></div>
            <img src="@img/homelogo.png" alt="" />
          </div>
          <div class="hender-container-top-name">
            长包房
          </div>
          <div class="hender-container-top-itemview">
            <router-link to="/hotel">
              <div class="hender-container-top-item">
                <span>酒店</span>
                <p class="sanjiao"></p>
              </div>
            </router-link>
            <router-link to="/house">
              <div class="hender-container-top-item">
                <span>房型</span>
                <p class="sanjiao"></p>
              </div>
            </router-link>
            <router-link to="/order">
              <div class="hender-container-top-item">
                <span>订单</span>
                <p class="sanjiao"></p>
              </div>
            </router-link>
            <router-link to="/other">
              <div class="hender-container-top-item">
                <span>其他</span>
                <p class="sanjiao"></p>
              </div>
            </router-link>
          </div>
          <div class="hender-container-top-admin">
            <div class="top-admin-icon">
              <img src="@img/admin.png" alt="" />
            </div>
            <div class="top-admin-info">
              <p>Admin</p>
              <p><span>设置&nbsp;&nbsp;</span>账号管理</p>
            </div>
            <div class="top-admin-icon-message">
              <img src="@img/message.png" alt="" />
            </div>
          </div>
          <div class="hender-container-top-layout">
            <div class="top-layout-item" @click="exit()">退出</div>
          </div>
        </div>
      </div>
      <!-- <div id="nav">
        <p>{{authorName}}{{author}}</p>
        <p>{{texthotel}}</p>
        <p>{{textorder}}</p>
        <p>{{textPlus}}</p>
        <router-link to="/">Home</router-link> 
        <router-link to="/about">About</router-link>
      </div> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
/**vuex帮助方法
 * 传入 值名 获得state里声明的值
 ...mapState(['authorName']),
*/
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Header",
  components: {
    // HelloWorld
  },
  mounted() {
    //外部直接修改state在开发中是不规范不被允许的，修改数据放在mutations中做
    // this.$store.state.authors='xxxx'
    this["hotel/updateText"]("12355");
    this["hotel/add"]();
    // this[('12355')
  },
  methods: {
    ...mapMutations(["hotel/updateText"]),
    ...mapActions(["hotel/add"]),
    exit() {
      this.$store.commit("REMOVE_TOKEN");
      this.$router.push({ path: "/login" });
    }
  },
  computed: {
    texthotel() {
      //hotel模块state
      return this.$store.state.hotel.text;
    },
    ...mapState(["authors"]),
    ...mapState({
      author: "authors",
      authorfunction: state => state.authors,
      textorder: state => state.order.text
    }),
    // authorName(){
    //   return this.$store.getters.authorName
    // }
    ...mapGetters(["authorName"]),
    ...mapGetters({
      textPlus: "hotel/textplus"
    })
  }
};
</script>
<style lang="less">
.Home-main-hender {
  width: 100%;
  background-color: #409eff;
  &-container {
    width: 1100px;
    height: 70px;
    margin: 0 auto;
    .hender-container-top {
      height: 70px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      &-icon {
        width: 80px;
        height: 78px;
        border-radius: 50%;
        margin-top: 30px;
        background-color: #fff;
        text-align: center;
        line-height: 78px;
        position: relative;
        .top-icon-bg1 {
          position: absolute;
          width: 87px;
          height: 87px;
          top: 0%;
          right: 50%;
          transform: translate(50%, -5%);
          border-radius: 50%;
          opacity: 0.4;
          background: #fbfbfb;
        }
        .bg2 {
          width: 95px;
          height: 95px;
          margin-top: -4px;
          opacity: 0.29;
        }
        img {
          z-index: 10;
          top: 10%;
          right: 50%;
          transform: translate(50%, 0%);
          position: absolute;
          width: 55px;
          height: 55px;
        }
        .top-icon-bg1::before,
        .top-icon-bg1::after {
          content: "";
          position: absolute;
          margin-left: auto;
          margin-right: auto;
          top: 50%;
          right: -2%;
          transform: translate(100%, 50%) scale(1);
          background: #fff;
          border-radius: 300px;
          z-index: 0;
        }
        .top-icon-bg1::before {
          width: 95px;
          height: 95px;
          transform: translate(0, -50%) scale(0);
          animation: flareScale 1.8s 0.5s infinite ease-out;
        }
        .top-icon-bg1::after {
          width: 95px;
          height: 95px;
          transform: translate(0, -50%) scale(0);
          animation: flareScale 1.8s infinite ease-out;
        }
        @keyframes flareScale {
          0% {
            transform: translate(0, -50%) scale(0.3);
          }
          100% {
            transform: translate(0, -50%) scale(1.6);
            opacity: 0;
          }
        }
      }
      &-name {
        cursor: pointer;
        width: 150px;
        color: #fff;
        font-size: 32px;
        margin-left: 30px;
        letter-spacing: 3px;
      }
      &-itemview {
        height: 100%;
        font-size: 20px;
        letter-spacing: 5px;
        display: flex;
        flex-direction: row;
        cursor: pointer;
        a {
          .hender-container-top-item {
            height: 70px;
            width: 120px;
            line-height: 70px;
            text-align: center;
            color: #fff;
            position: relative;
          }
          &.router-link-active {
            background-color: rgba(21, 133, 225, 0.8);
            .hender-container-top-item {
              .sanjiao {
                opacity: 1;
                position: absolute;
                top: 83%;
                right: 50%;
                transform: translate(50%, 50%);
                border-right: 8px solid transparent;
                border-left: 8px solid transparent;
                border-bottom: 8px solid #22313e;
              }
            }
          }
        }
        a:hover {
          background-color: rgba(21, 133, 225, 0.8);
        }
      }
      &-admin {
        cursor: pointer;
        // width: 120px;
        // background-color: #fff;
        margin-left: 100px;
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        flex-direction: row;
        border-left: 1px solid #fbfbfb;
        border-right: 1px solid #fbfbfb;
        height: 100%;
        align-items: center;
        .top-admin-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 2px solid #fff;
          background-color: #fff;
          img {
            width: 100%;
          }
        }
        .top-admin-info {
          color: #fff;
          line-height: 20px;
          margin-left: 15px;
          font-size: 15px;
        }
        .top-admin-icon-message {
          width: 30px;
          height: 30px;
          margin-left: 15px;
          img {
            width: 100%;
          }
        }
      }
      &-layout {
        cursor: pointer;
        height: 100%;
        color: #fff;
        font-size: 17px;
        letter-spacing: 4px;
        .top-layout-item {
          position: absolute;
          top: 25px;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
