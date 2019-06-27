<template>
  <div class="OrderList-main-container">
    <div class="OrderList-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <el-form-item label="订单状态">
          <el-select
            v-model="searchform.orderState"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in orderoption"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客人姓名">
          <el-input v-model="searchform.name"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchform.orderNumber" type="number"></el-input>
        </el-form-item>
        <el-form-item label="下单日期">
          <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              v-model="changetime.createTime"
              placeholder="选择下单日期"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="日期选择">
           <el-date-picker
              v-model="changetime.Timevalue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="城市区域">
          <el-select
            v-model="searchform.cityId"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in cityoption"
              :key="item.id"
              :label="item.cityName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="酒店">
            <el-select v-model="searchform.hotelName" filterable clearable>
              <el-option
                v-for="item in commitAllHotel"
                :key="item.id"
                :label="item.hotelName"
                :value="item.hotelName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item>
          <el-button type="success" style="width:100px" @click="tosearch"
            >查询订单</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="OrderList-main-container-list">
      <el-table ref="multipleTable" :data="tableData" style="width: 100%">
        <el-table-column width="90" label="订单ID" prop="id" />
        <el-table-column width="100" label="城市" prop="cityName" />
        <el-table-column width="170" label="酒店" prop="hotelName" />
        <el-table-column width="150" label="入离时间">
          <template slot-scope="scope">
            {{scope.row.startTime}}至
            <br>
            {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column width="150" label="入住人">
          <template slot-scope="scope" >
            {{scope.row.name}}<br><span style="color:#989797">({{scope.row.peoples}})人</span>
          </template>
        </el-table-column>
        <el-table-column width="170" label="房型">
          <template slot-scope="scope">
            {{scope.row.roomName}}<{{scope.row.bedType}}>
          </template>
        </el-table-column>
        <el-table-column width="150" label="订单/支付状态 " prop="orderStatetext"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button
                v-if="scope.row.orderState==3"
                size="small"
                type="primary"
                @click="refundAudit(scope.$index, scope.row)"
                >审核
              </el-button>
              <el-button
                v-if="scope.row.orderState==5"
                size="small"
                type="success"
                @click="leaveRefundAudit(scope.$index, scope.row)"
                >退押金
              </el-button>
              <el-button
                v-if="scope.row.orderState!=5"
                size="small"
                type="danger"
                @click="stopoder(scope.$index, scope.row)"
                >结束订单
              </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="OrderList-main-container-pagination">
        <!-- 分页 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 修改增加 -->
      <el-dialog :visible.sync="dialogFormVisible" :title="title">
        <el-form
          :rules="rules"
          ref="changeinfoall"
          :model="changeinfoall"
          label-width="120px"
          style="width:70%;margin:0 auto"
        >
          <el-form-item label="酒店ID" v-if="!addhotel">
            <el-input
              v-model="changeinfoall.id"
              disabled
              style="width:130px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="酒店名称" prop="hotelName" required>
            <el-input v-model="changeinfoall.hotelName"></el-input>
          </el-form-item>
          <el-form-item label="城市" class="is-required">
            <el-select v-model="changecity" style="width:130px;">
              <el-option
                v-for="item in orderoption"
                :key="item.id"
                :label="item.cityName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="酒店地址">
            <el-input v-model="changeinfoall.address"></el-input>
          </el-form-item>
          <el-form-item label="酒店介绍">
            <el-input
              v-model="changeinfoall.introduce"
              type="textarea"
              rows="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input
              style="width:180px;"
              v-model="changeinfoall.telephone"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="酒店品牌">
            <el-select v-model="changeinfoall.brandId" placeholder="请选择">
              <el-option
                v-for="item in getbrandoption"
                :key="item.id"
                :label="item.brandName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="星级">
            <el-rate
              v-model="changeinfoall.star"
              style="margin-top:10px;"
            ></el-rate>
          </el-form-item>
          <el-form-item label="售卖状态" prop="saleStatus" required>
            <el-select
              v-model="changeinfoall.saleStatus"
              placeholder="请选择售卖状态"
              style="width:130px;"
            >
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最晚预定时间">
            <el-time-picker
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              v-model="changeinfoall.createTime"
              placeholder="选择最晚预定时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="最晚确定时间">
            <el-time-picker
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              v-model="changeinfoall.lastConfirm"
              placeholder="选择最晚确定时间"
            >
            </el-time-picker>
          </el-form-item>
          <!-- 管理 -->
          <el-form-item label="酒店图集" v-if="!addhotel">
            <template>
              <div class="flexrow imgflex">
                <img
                  v-if="urls.length == 0"
                  style="width: 280px; height: 180px"
                  src="@img/noimg.png"
                  alt=""
                />
                <!-- <el-image
                  style="width: 250px; height: 180px" src="@img/noimg.png" :fit="contain">
                </el-image> -->
                <div class="hotellazy" v-if="urls.length > 0">
                  <!-- <el-image v-for="url in showurls" :key="url" :src="url"></el-image> -->
                  <el-image v-for="url in urls" :key="url.id" :src="url.url">
                  </el-image>
                </div>
                <div class="hotelimgadmin">
                  <el-button
                    size="small"
                    type="primary"
                    @click="hotelimgVisible = !hotelimgVisible"
                    >管理</el-button
                  >
                </div>
              </div>
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <!-- 新增酒店 -->
          <el-button
            type="primary"
            @click="addapproval('changeinfoall')"
            v-if="!changehotel"
            >确 定</el-button
          >
          <!-- 修改酒店 -->
          <el-button
            type="primary"
            @click="updataapproval('changeinfoall')"
            v-if="!addhotel"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Qs from "qs";
import {
  selectHotelList,
  insertHotel,
  insertHotelArea,
  selectAlbums,
  selectBrands,
  selectAllCities,
  selectHotelapi,
  updateByPrimaryKey,
  selectHotelareaapi,
  deleteAlbumapi,
  selectAllCityAreas,
  selectOrders,
  leaveRefundAudit,
  refundAudit
} from "@/api/api.js";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { listAssign } from "@/assets/js/common.js";
import { getCookie } from "@/assets/js/cookie.js";
// import { stat } from 'fs';
// import { log } from 'util';
export default {
  name: "oderList",
  data() {
    return {
      orderoption:this.GLOBAL.orderoption,
      searchform: {
        orderNumber: null,
        orderState: null,
        name: null,
        createTime:null,
        Timevalue:[],
        cityId:null,
        hotelName:null,
      },
      timedialogVisible: false, //时间dialog
      dialogFormVisible: false, //修改，增加dialog
      tableData: [], //酒店list
      total: null, //总条数
      pageSize: 8 , //每页显示数量，后台确定
      cur_page: 1, //当前页
      changecity: null, //管理的城市id,用于数据监听
      checkedEquipments: [], //多选框修改后的checked项（即要传到后台的变更数据）
      saveEquipments: [], //
      changetime: {},
      changeinfoall: { hotel_name: "" },
      title: null,
      addhotel: false, //增加操作 用于v-if
      changehotel: false, //修改操作 用于v-if
      urls: [], //图集列表
      fileList: [], // fileList: [{name: '', url: ''}],
      // score: Array(5).fill({ src: "@/assets/img/star.png" }),
      options2: [{ value: 1, label: "停售" }, { value: 0, label: "在售" }],
      CityAreaList: null,
      show: false, // 控制组件显示
      uploadUrl: "/apis/album/uploadAlbum", // 上传地址
      params: { hotelId: null }, //传递参数
      myHeader: { Authorization: "Bearer " + getCookie("jwt") },
      fieldName: "pic", // 上传文件名
      noCircle: true,
      noSquare: false,
      width: 600, // 裁剪图片宽高(即所需要图片的宽高)
      height: 375,
      maxSize: 10240, // 大小限制
      rules: {
        hotelName: [
          { required: true, message: "请输入酒店名称", trigger: "blur" }
        ],
        saleStatus: [
          { required: true, message: "请选择售卖状态", trigger: "change" }
        ]
      }
    };
  },
  created: function() {
    selectAllCities({})
      .then(res => {
        this.$store.commit("hotel/commitCityOption", res.cities);
      })
      .catch(err => {
        console.log(err);
      });
    ///需要请求
    selectAllCityAreas({})
      .then(res => {
        this.$store.commit("hotel/commitCityArea", res.citieAreas);
        this.CityAreaList = JSON.parse(JSON.stringify(this.commitCityArea));
        console.log("全球结果");
        console.log(this.CityAreaList);
      })
      .catch(err => {});
    //需要请求品牌
    selectBrands({})
      .then(res => {
        console.log(res.result);
        this.$store.commit("hotel/commitBrandList", res.result);
        console.log(this.getbrandoption); //getter回来的brandoption
      })
      .catch(err => {});
  },
  mounted() {
    if (!this.$store.state.cityoption) {
      selectAllCities({}).then(res => {
        this.$store.commit("hotel/commitCityOption", res.cities);
      });
    }
    if(!this.$store.state.allHotelList){
      selectHotelList({})
        .then(res => {
          this.$store.commit("hotel/commitAllHotel", res.result);
        })
    }
  },
  computed: {
    ...mapGetters({
      // textPlus: "hotel/getCityOption"
      getbrandoption: "hotel/getbrandoption" //可选品牌
    }),
    ...mapState({
      commitAllHotel: state => state.hotel.allHotelList,
      cityoption: state => state.hotel.cityoption,
      commitCityArea: state => state.hotel.commitCityArea
    })
  },
  watch: {
  },
  methods: {
    //分页器
    handleCurrentChange(val) {
      this.cur_page = val;
      console.log("当前页" + this.cur_page);
      this.tosearch();
    },
    //查询订单
    tosearch() {
      console.log("tosearch重新加载");

      var searchparm = JSON.parse(JSON.stringify(this.searchform));
      searchparm.startTime=searchparm.Timevalue[0];
      searchparm.endTime=searchparm.Timevalue[1];
      console.log(searchparm);
      //过滤多条件查询参数t
      for (var attr in searchparm) {
        if (searchparm[attr] === null || searchparm[attr] === "") {
          // console.log(attr);
          delete searchparm[attr];
          continue;
        }
      }
      delete searchparm['Timevalue'];
      searchparm.page = this.cur_page;
      searchparm.pageSize=8;
      selectOrders(searchparm)
        .then(res => {
          console.log(res);
          console.log("重新加载selectHotelapi");
          this.tableData = res.result.list;
          this.total = res.result.total;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].orderStatetext=this.orderoption[this.tableData[i].orderState].label;
          }
          console.log("重新加载selectHotelapi");
          console.log(this.tableData);
        })
        .catch(err => {});
      //深拷贝
      // var CityAreaList=JSON.parse(JSON.stringify(this.commitCityArea));
      // console.log(CityAreaList);
    },
    toadd() {
      this.urls = [];
      this.changeinfoall = {};
      this.changecity = null; //置空城市
      this.checkedEquipments = []; //置空已选中区域
      this.childMenu = []; //置空城市子区域
      this.dialogFormVisible = true;
      this.addhotel = true;
      this.changehotel = false;
      this.title = "新增酒店";
    },
    //设定最晚时间
    setorder(index, row) {
      console.log();
      this.timedialogVisible = true;
      this.changetime = row;
      console.log(this.changetime);
    },
    //确认设置最晚时间
    suretime() {
      this.timedialogVisible = false;
      var changeparm = {
        id: this.changetime.id + "",
        lastConfirm: this.changetime.lastConfirm,
        createTime: this.changetime.createTime
      };
      updateByPrimaryKey(changeparm)
        .then(res => {
          console.log(res);
          if (res.message == "SUCCESS") {
            this.$message("修改成功", res.message);
          }
        })
        .catch(err => {
          this.$message("修改失败", res.message);
        });
    },
    //修改售卖状态更改
    uploadhotel(row, meaasge) {
      row.saleStatus = meaasge;
      var changeparm = { id: row.id + "", saleStatus: meaasge };
      updateByPrimaryKey(changeparm)
        .then(res => {
          if (res.message == "SUCCESS") {
            // this.tosearch();
            this.$message("修改成功", res.message);
          }
        })
        .catch(err => {
          this.$message("修改失败", res.message);
        });
      // console.log(row);
    },
    
    //新增酒店
    addapproval(changeinfoall) {
      this.$refs[changeinfoall].validate(valid => {
        if (
          valid == true &&
          this.checkedEquipments.length != 0 &&
          this.changecity != null
        ) {
          // console.log("新增酒店");
          // console.log(this.changeinfoall);
          var newhotelinfo = {
            hotelName: "",
            brandId: null,
            saleStatus: 0,
            createTime: null,
            lastConfirm: null,
            star: null,
            address: null,
            telephone: null,
            introduce: null,
            remain: null,
            id: null
          };
          listAssign(newhotelinfo, this.changeinfoall);
          // console.log(newhotelinfo);
          insertHotel(newhotelinfo)
            .then(res => {
              // console.log(res);
              if (res.message == "SUCCESS") {
                if (this.updateArea(res.HotelId, this.checkedEquipments)) {
                  this.tosearch();
                  this.$message("新增成功", res.message);
                  this.changecity = null;
                  this.changeinfoall = { hotel_name: "" };
                  this.dialogFormVisible = false;
                  this.$confirm("是否为酒店增加图片")
                    .then(_ => {
                      this.uploadnewimg(res.HotelId);
                    })
                    .catch(_ => {});
                } else {
                  this.$message("修改失败", res.message);
                }
              }
            })
            .catch(err => {});
        } else {
          this.$message({
            message: "请填写相关信息",
            type: "warning"
          });
          return false;
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //退款审核
    refundAudit(index, row){
      
      
    },
    //离店退押金审核
    leaveRefundAudit(index,row){
      
    },
    //管理操作 强制停止
    stopoder(index, row) {
      console.log("saveEquipments");
      this.$confirm("是否终止该订单")
        .then(_ => {
          // selectHotelareaapi({ hotelId: this.changeinfoall.id })
          // .then(res => {
          // })
          // .catch(err => {
          //   this.$message({
          //     showClose: true,
          //     message: "请求失败，请稍后再试",
          //     type: "error"
          //   });
          // });
        })
        .catch(_ => {});
      
    },
    toggleShow() {
      this.show = !this.show;
    },
    cropUploadSuccess(jsonData, field) {
      // console.log('-------- upload success --------');
      this.loadingimg(this.params.hotelId);
      // console.log(jsonData);
      // console.log('field: ' + field);
    }
  }
};
</script>
<style lang="less" scoped>
.OrderList-main-container {
  width: 1180px;
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
  &-pagination {
    float: right;
    margin: 20px 20px 0 0;
  }
  .score-popover {
    display: flex;
    flex-direction: row;
    img {
      width: 20px;
    }
  }
  .imgflex {
    align-items: flex-end;
    .hotelbanner {
      margin-top: 10px;
      border-radius: 5px;
      width: 300px;
      height: 188px;
      .hotelbanner-carousel {
        height: 100%;
      }
    }
    .hotellazy {
      width: 250px;
      height: 180px;
      overflow: scroll;
    }
    .hotelimgadmin {
      margin-left: 30px;
    }
  }
  .img-show-view {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
    .img-show-item {
      // width:23%;
      margin: 5px;
      position: relative;
    }
    .delete-icon {
      color: red;
      position: absolute;
      top: -7px;
      right: -3px;
      z-index:1;
    }
    .img-show-btn {
      margin-top: 5px;
      margin-left: 10px;
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 205px;
      height: 100px;
      text-align: center;
      cursor: pointer;
      line-height: 100px;
      vertical-align: top;
      font-size: 28px;
      color: #8c939d;
    }
  }
  .area-add-view {
    width: 30%;
    margin: 0 auto;
  }
}
</style>

