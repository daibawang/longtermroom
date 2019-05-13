<template>
  <div class="CityAdmin-main-container">
    <div class="CityAdmin-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <div class="container-city">
          <el-form-item label="城市">
            <el-select v-model="searchform.city" clearable>
              <el-option
                v-for="item in cityoption"
                :key="item.value"
                :label="item.city_name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              style="width:100px"
              @click="searcharea(searchform.city)"
              >查询</el-button
            >
            <el-button
              type="primary"
              style="width:100px"
              :disabled="admin"
              @click="areaabled = !areaabled"
              >管理</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <el-form
        :inline="true"
        :model="areaform"
        class="container-search-form formarea"
        v-if="areafromshow"
      >
        <div class="container-area">
          <el-form-item label="区域">
            <el-select
              :disabled="areaabled"
              v-model="value"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择区域"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              style="width:100px"
              @click="areasure()"
              v-if="!areaabled"
              >保存</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <UploadCutImg></UploadCutImg>
  </div>
</template>
<script>
import VueCropper from "vue-cropper";
import UploadCutImg from "@/components/UploadCutImg.vue";
export default {
  name: "hotelCity",
  components: {
    UploadCutImg
  },
  data() {
    return {
      admin: true,
      areaabled: true,
      areafromshow: false,
      searchform: {
        id: null,
        city: null,
        area: null
      },
      cityoption: [
        {
          value: 1,
          city_name: "上海"
        },
        {
          value: 2,
          city_name: "北京"
        }
      ],
      areaform: {},
      options: [
        {
          value: "商业区",
          label: "商业区"
        },
        {
          value: "行政区",
          label: "行政区"
        },
        {
          value: "旅游区",
          label: "旅游区"
        }
      ],
      value: ["旅游区"]
    };
  },
  created: function() {},
  methods: {
    //查询区域
    searcharea(cityid) {
      if (cityid != null) {
        this.admin = false;
        this.areafromshow = true;
      } else {
        this.$message({
          type: "warning",
          message: "请选择城市!"
        });
      }
      console.log(cityid);
      console.log(this.value);
    },
    areasure() {
      this.$confirm("确认更改城市区域信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.areaabled = true;
          this.$message({
            type: "success",
            message: "更改成功!"
          });
        })
        .catch(() => {
          this.areaabled = true;
          this.$message({
            type: "info",
            message: "已取消更改"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.CityAdmin-main-container {
  width: 1000px;
  // width: 80%;
  margin: 30px auto;
  &-search {
    width: 100%;
    background-color: #f7f8f8;
    padding: 50px 0;
    .container-search-form {
      width: 52%;
      margin: 10px auto;
      .container-city,
      .container-area {
        margin: 0 auto;
        display: flex;
        flex-direction: row;
      }
    }
    .formarea {
      margin-top: 30px;
    }
  }
  &-list {
    margin-top: 40px;
    width: 100%;
  }
}
</style>
