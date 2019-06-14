<template>
  <div class="BrandAdmin-main-container">
    <div class="BrandAdmin-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <el-form-item label="品牌ID">
          <el-input v-model="searchform.id" type="number"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input v-model="searchform.brandName"></el-input>
          <!-- <el-select v-model="searchform.brand_name" placeholder="请选择">
            <el-option
              v-for="item in getbrandoption"
              :key="item.id"
              :label="item.brandName"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="width:100px" @click="tosearch"
            >查询品牌</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100px" @click="toadd"
            >新增品牌</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="BrandAdmin-main-container-list">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column width="100" label="品牌ID" prop="id" />
        <el-table-column width="120" label="品牌名称" prop="brandName" />
        <el-table-column width="180" label="品牌ICON">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <img :src="scope.row.iconshow" width="150px" height="100px" />
              <img
                slot="reference"
                :src="scope.row.iconshow"
                width="100px"
                height="65px"
              />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="330" label="品牌详情">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p style="width:400px">详情: {{ scope.row.brandDetail }}</p>
              <div slot="reference" style="cursor: pointer;">
                {{ scope.row.brand_detail_sort }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="220" label="备注" prop="brandRemark">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              style="margin-left:7px"
              size="small"
              type="primary"
              @click="change(scope.$index, scope.row)"
              >修改</el-button
            >
            <!-- <el-button
              size="small"
              type="danger"
              @click="handleEdit(scope.$index, scope.row)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="branddialogVisible" :title="title">
        <el-form
          ref="from"
          :model="changebrand"
          label-width="120px"
          style="width:70%;margin:0 auto"
        >
          <el-form-item label="品牌ID" v-if="title == '修改品牌'">
            <el-input v-model="changebrand.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="品牌名称">
            <el-input v-model="changebrand.brandName"></el-input>
          </el-form-item>
          <el-form-item label="品牌图标">
            <template>
              <div class="flexrow">
                <img
                  :src="changebrand.iconshow"
                  alt=""
                  width="100px"
                  height="65px"
                  v-if="changebrand.iconshow"
                />
                <div :class="changebrand.iconshow ? 'flexrow-upload' : ''">
                  <el-button size="mini" type="primary" @click="show = true">
                    Upload<i class="el-icon-upload el-icon--right"></i
                  ></el-button>
                </div>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="品牌详情">
            <el-input
              v-model="changebrand.brandDetail"
              type="textarea"
              rows="8"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="changebrand.brandRemark"
              type="textarea"
              rows="3"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="branddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addapproval">确 定</el-button>
        </div>
      </el-dialog>
      <my-upload
        field="pic"
        @crop-upload-success="cropUploadSuccess"
        v-model="show"
        :width="width"
        :height="height"
        :url="uploadUrl"
        :noCircle="true"
        :noSquare="noSquare"
        :headers="myHeader"
        :maxSize="maxSize"
        img-format="png"
      >
      </my-upload>
    </div>
  </div>
</template>
<script>
import {
  selectBrands,
  selectBrandByMany,
  updateBrand,
  insertBrand
} from "@/api/api.js";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { subString } from "@/assets/js/common.js";
import myUpload from "vue-image-crop-upload";
import { getCookie } from "@/assets/js/cookie.js";
export default {
  name: "hotelBrand",
  components: {
    "my-upload": myUpload
  },
  data() {
    return {
      branddialogVisible: false,
      changebrand: {},
      title: "",
      show: false,
      // 控制组件显示
      cropperShow: false,
      // 上传地址
      uploadUrl: "/apis/upload/uploadPic",
      myHeader: { Authorization: "Bearer " + getCookie("jwt") },
      noCircle: true,
      noSquare: false,
      width: 300, // 裁剪图片宽高(即所需要图片的宽高)
      height: 175,
      maxSize: 10240, // 大小限制
      fileList1: [],
      searchform: {
        id: null,
        brandName: null
      },
      tableData: []
    };
  },
  created: function() {},
  mounted() {
    if (!this.$store.state.brandList) {
      selectBrands({}).then(res => {
        this.$store.commit("hotel/commitBrandList", res.result);
      });
    }
  },
  computed: {
    ...mapGetters({
      // textPlus: "hotel/getCityOption"
      getbrandoption: "hotel/getbrandoption" //可选品牌
    })
    // ...mapState({
    //   cityoption: state => state.hotel.cityoption,
    //   commitCityArea:state => state.hotel.commitCityArea
    // }),
  },
  methods: {
    //查询品牌
    tosearch() {
      var searchparm = JSON.parse(JSON.stringify(this.searchform));
      //过滤多条件查询参数t
      for (var attr in searchparm) {
        if (searchparm[attr] === null || searchparm[attr] === "") {
          // console.log(attr);
          delete searchparm[attr];
          continue;
        }
      }
      selectBrandByMany(searchparm).then(res => {
        this.tableData = res.result;
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].brand_detail_sort = subString(
            this.tableData[i].brandDetail,
            100,
            true
          );
          this.tableData[i].iconshow = "apis/image/" + this.tableData[i].icon;
        }
      });
    },
    //修改品牌信息
    change(index, row) {
      console.log();
      this.title = "修改品牌";
      this.branddialogVisible = true;
      this.changebrand = row;
    },
    //确定修改
    addapproval() {
      var parm = JSON.parse(JSON.stringify(this.changebrand));
      delete parm["brand_detail_sort"];
      if (this.title == "新增品牌") {
        delete parm["id"];
        if (this.changebrand.icon == null) {
          this.$confirm("请上传品牌图标");
        } else {
          insertBrand(parm).then(res => {
            if (res.message == "SUCCESS") {
              this.$message(this.title + "成功", res.message);
              this.tosearch();
              this.branddialogVisible = false;
            }
          });
        }
      }
      if (this.title == "修改品牌") {
        delete parm["icon"];
        delete parm["iconshow"];
        updateBrand(parm).then(res => {
          if (res.message == "SUCCESS") {
            this.$message(this.title + "成功", res.message);
            this.tosearch();
            this.branddialogVisible = false;
          }
        });
      }
    },
    //新增品牌
    toadd() {
      this.title = "新增品牌";
      this.changebrand = {};
      this.branddialogVisible = true;
    },
    onBeforeUpload() {},
    handleExceed() {},
    cropUploadSuccess(jsonData, field) {
      console.log("-------- upload success --------");
      console.log(jsonData);
      this.changebrand.iconshow = "apis/image/" + jsonData.path[0];
      this.changebrand.icon = jsonData.path[0];
      if (this.title == "修改品牌") {
        var parm = { id: this.changebrand.id, icon: jsonData.path[0] };
        updateBrand(parm).then(res => {
          if (res.message == "SUCCESS") {
            this.tosearch();
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.BrandAdmin-main-container {
  width: 1100px;
  // width: 80%;
  margin: 30px auto;
  &-search {
    width: 100%;
    background-color: #f7f8f8;
    padding: 10px 0;
    .container-search-form {
      width: 90%;
      margin: 10px auto;
      .el-form-item {
        margin: 10px 20px;
      }
    }
  }
  &-list {
    margin-top: 40px;
    width: 100%;
    .flexrow {
      display: flex;
      flex-direction: row;
      .flexrow-upload {
        margin-top: 30px;
        margin-left: 30px;
      }
    }
  }
}
</style>
