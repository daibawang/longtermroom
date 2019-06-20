<template>
  <div class="Hotel-index-hender">
    <div class="Hotel-index-hender-container">
      <div class="Hotel-container-view">
        <div class="Hotel-container-view-placeholder" :style="styles"></div>
        <div class="Hotel-container-view-itemview">
          <div v-for="item in creatRouter" :key="item.path">
            <router-link :to="item.path">
              <div class="hender-container-item">
                <div class="active">
                  <span>{{ item.meta.title }}</span>
                </div>
              </div>
            </router-link>
          </div>
          <!-- <router-link to="hotelAdd">
                        <div class="hender-container-item">
                            <div class="active">
                                <span>新增酒店</span>
                            </div>
                        </div>
                    </router-link> -->
          <!-- <router-link to="hotelAdmin">
                        <div class="hender-container-item">
                            <div class="active">
                                <span>酒店管理</span>
                            </div>
                        </div>
                    </router-link> -->
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "HeaderSecond",
  data() {
    return {
      styles: {
        width: "270px"
      }
    };
  },
  computed: {
    ...mapGetters({
      creatRouter: "creatRouter",
      whatRouter: "whatRouter"
    })
  },
  created: function() {
    if (this.whatRouter == "House") {
      this.styles.width = "380px";
    } else if (this.whatRouter == "Hotel") {
      this.styles.width = "260px";
    } else if (this.whatRouter == "Order") {
      this.styles.width = "500px";
    }else if (this.whatRouter == "Other") {
      this.styles.width = "620px";
    }
  }
};
</script>

<style lang="less" scoped>
.Hotel-index-hender {
  width: 100%;
  height: 42px;
  background-color: #22313e;
  &-container {
    width: 1100px;
    height: inherit;
    margin: 0 auto;
    .Hotel-container-view {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      &-placeholder {
        width: 260px;
      }
      &-itemview {
        width: 360px;
        font-size: 15px;
        letter-spacing: 2px;
        height: 100%;
        align-items: center;
        display: flex;
        flex-direction: row;
        a {
          .hender-container-item {
            cursor: pointer;
            width: 120px;
            margin-right: 40px;
            padding: 0px 12px;
            text-align: center;
            color: #fff;
            .active {
            }
          }
          .hender-container-item:hover {
            .active {
              color: #409eff;
              // width: 60px;
              height: 22px;
              margin: 0px auto;
              background-color: #fff;
              border-radius: 20px;
            }
          }
          &.router-link-active {
            .active {
              color: #409eff;
              // width: 60px;
              height: 22px;
              margin: 0px auto;
              background-color: #fff;
              border-radius: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
