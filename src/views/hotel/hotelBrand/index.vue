<template>
  <div class="BrandAdmin-main-container">
    <div class="BrandAdmin-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <el-form-item label="品牌ID">
          <el-input v-model="searchform.hotel_name" type="number"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input v-model="searchform.hotel_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="width:100px">查询品牌</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100px" @click="toadd"
            >新增品牌</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="BrandAdmin-main-container-list">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column width="100" label="品牌ID" prop="id" />
        <el-table-column width="120" label="品牌名称" prop="brand_name" />
        <el-table-column width="200" label="品牌ICON">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <img :src="scope.row.icon" width="150px" height="120px" />
              <img
                slot="reference"
                :src="scope.row.icon"
                width="95px"
                height="70px"
              />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="320" label="品牌详情">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p style="width:400px">详情: {{ scope.row.brand_detail }}</p>
              <div slot="reference" style="cursor: pointer;">
                {{ scope.row.brand_detail_sort }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="200" label="备注" prop="brand_remark">
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
            <el-button
              size="small"
              type="danger"
              @click="handleEdit(scope.$index, scope.row)"
              >删除</el-button
            >
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
            <el-input v-model="changebrand.brand_name"></el-input>
          </el-form-item>
          <el-form-item label="品牌图标">
            <template>
              <div class="flexrow">
                <img
                  src=""
                  alt=""
                  width="150px;heigh:250px;"
                  v-if="title == '修改品牌'"
                />
                <el-upload
                  class="upload-demo"
                  :action="params.action"
                  :before-upload="onBeforeUpload"
                  multiple
                  :limit="1"
                  :data="params.data1"
                  :auto-upload="true"
                  :on-exceed="handleExceed"
                  :file-list="fileList1"
                >
                  <el-button size="mini" type="primary"
                    >Upload<i class="el-icon-upload el-icon--right"></i
                  ></el-button>
                  <span style="font-size:11px;">上传图片</span>
                </el-upload>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="品牌详情">
            <el-input
              v-model="changebrand.brand_detail"
              type="textarea"
              rows="8"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="changebrand.brand_remark"
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
    </div>
  </div>
</template>
<script>
export default {
  name: "hotelBrand",
  data() {
    return {
      branddialogVisible: false,
      changebrand: {},
      title: "",
      params: {
        action: "https://www.istuadmission.com/BlueSky/UploadServlet",
        data1: { aid: null, title: "", info: "", img: null }
      },
      fileList1:[],
      searchform: {
        id: null,
        brand_name: null
      },
      tableData: [
        {
          id: 1,
          brand_name: "康莱德",
          icon: "%E5%BA%B7%E8%8E%B1%E5%BE%B7%E5%93%81%E7%89%8CLOGO.jpg",
          iconimg: "",
          brand_detail_sort:
            "以“微笑服务”为理念，以打造“宾至如归”的奢华舒适体验为目标。遍及90个国家和地区的近5,000家酒店...",
          brand_detail:
            "以“微笑服务”为理念，以打造“宾至如归”的奢华舒适体验为目标。遍及90个国家和地区的近5,000家酒店，包括希尔顿酒店，华尔道夫酒店，康莱德酒店，希尔顿逸林和希尔顿花园酒店等10大品牌。",
          brand_remark: "暂无"
        }
      ]
    };
  },
  created: function() {},
  methods: {
    //修改品牌信息
    change(index, row) {
      console.log();
      this.title = "修改品牌";
      this.branddialogVisible = true;

      this.changebrand = row;
    },
    //确定修改
    addapproval() {
      this.branddialogVisible = false;
    },
    //新增品牌
    toadd() {
      this.title = "新增品牌";
      this.changebrand = {};
      this.branddialogVisible = true;
    },
    onBeforeUpload(){

    },
    handleExceed(){

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
  }
}
</style>
