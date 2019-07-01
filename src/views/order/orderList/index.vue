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
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
              v-model="searchform.createTime"
              placeholder="选择下单日期"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="日期选择">
           <el-date-picker
              v-model="searchform.Timevalue"
              type="daterange"
              value-format="yyyy-MM-dd"
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
        <el-table-column width="150" label="订单ID" prop="orderNumber" />
        <el-table-column width="90" label="城市" prop="cityName" />
        <el-table-column width="170" label="酒店" prop="hotelName" />
        <el-table-column width="140" label="入离时间">
          <template slot-scope="scope">
            {{scope.row.startTime}}至
            <br>
            {{scope.row.endTime}}
          </template>
        </el-table-column>
        <el-table-column width="130" label="入住人">
          <template slot-scope="scope" >
            {{scope.row.name}}<br><span style="color:#989797">({{scope.row.peoples}})人</span>
          </template>
        </el-table-column>
        <el-table-column width="170" label="房型">
          <template slot-scope="scope">
            {{scope.row.roomName}}<{{scope.row.bedType}}>
          </template>
        </el-table-column>
        <el-table-column width="140" label="订单/支付状态 " prop="orderStatetext"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button
                v-if="scope.row.orderState==2"
                size="small"
                type="primary"
                @click="refundAudit(scope.$index, scope.row)"
                >审核
              </el-button>
              <el-button
                v-if="scope.row.orderState==4"
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
      <el-dialog :visible.sync="leavedia" title="押金审核">
        <el-form
          ref="leaveinfo"
          :model="leaveinfo"
          label-width="120px"
          style="width:70%;margin:0 auto"
        >
          <el-form-item label="订单ID">
            <el-input
              v-model="leaveinfo.orderNumber"
              disabled
              style="width:170px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="退款金额" required>
            <el-radio v-model="agree" label='true'>全额退款</el-radio>
            <el-radio v-model="agree" label='false'>部分退款</el-radio>
          </el-form-item>
          <el-form-item label="扣除金额" v-if="showreturn">
            <el-input
              v-model="leaveinfo.money"
              style="width:120px"
              type="number"
            ></el-input>
            元
          </el-form-item>
          <el-form-item label="扣除理由" v-if="showreturn">
            <el-input
              v-model="leaveinfo.drefundEpositReason"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="leavedia = false">取 消</el-button>
          <el-button
            type="primary"
            @click="updataapproval()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog :visible.sync="returndia" title="订单审核">
        <el-form
          ref="returninfo"
          :model="returninfo"
          label-width="120px"
          style="width:70%;margin:0 auto"
        >
          <el-form-item label="订单ID">
            <el-input
              v-model="returninfo.orderNumber"
              disabled
              style="width:170px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="退款金额" required>
            <el-radio v-model="returnagree" label='true'>通过</el-radio>
            <el-radio v-model="returnagree" label='false'>不通过</el-radio>
          </el-form-item>
          <el-form-item label="不通过理由" v-if="showpass">
            <el-input
              v-model="returninfo.refuseRefundReason"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="returndia = false">取 消</el-button>
          <el-button
            type="primary"
            @click="passapproval()"
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
  selectBrands,
  selectAllCities,
  selectHotelapi,
  selectAllCityAreas,
  selectOrders,
  leaveRefundAudit,
  refundAudit,
  stoporder,
  leavehotel
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
        Timevalue:'',
        cityId:null,
        hotelName:null,
      },
      leavedia:false, //退押金dialog
      returndia:false,
      showpass:false,
      agree:'true',
      returnagree:'true',
      leaveinfo:{
        orderNumber:null,
        money:null,
        drefundEpositReason:null
      },
      returninfo:{
        orderNumber:null,
        refuseRefundReason:null
      },
      showreturn:false,
      tableData: [], //酒店list
      total: null, //总条数
      pageSize: 8 , //每页显示数量，后台确定
      cur_page: 1, //当前页
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
    agree(newName, oldName) {
      if(newName=='false'){
        this.showreturn=true;
      }else{
        this.showreturn=false;
      }
    },
    returnagree(newName, oldName){
      if(newName=='false'){
        this.showpass=true;
      }else{
        this.showpass=false;
      }
    }
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
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //退款审核
    refundAudit(index, row){
      this.returndia=true;
      this.returninfo.orderNumber=row.orderNumber;

    },
    passapproval(){
      var param=JSON.parse(JSON.stringify(this.returninfo));
      param.agree=this.returnagree=='true'?true:false;
      refundAudit(param)
        .then(res=>{
          if(res.msg=="成功"){
            this.tosearch();
            this.returninfo={
              orderNumber:null,
              refuseRefundReason:null,
            };
            this.returnagree='true';
            this.returndia=false;
            this.$message({
                showClose: true,
                message: "审核成功",
                type: "success"
            });
          }
          
        })
    },
    //离店退押金审核
    leaveRefundAudit(index,row){
      this.leavedia=true;
      this.leaveinfo.orderNumber=row.orderNumber;
      // 
    },
    updataapproval(){
      var param=JSON.parse(JSON.stringify(this.leaveinfo));
      param.agree=this.agree=='true'?true:false;
      leavehotel(param)
        .then(res=>{
          if(res.msg=="成功"){
            this.tosearch();
            this.leaveinfo={
              orderNumber:null,
              money:null,
              drefundEpositReason:null
            };
            this.agree='true';
            this.leavedia=false;
            this.$message({
                showClose: true,
                message: "退押金成功",
                type: "success"
            });
          }
          
        })
    },
    //管理操作 强制停止
    stopoder(index, row) {
      console.log("进来了");
      
      console.log("saveEquipments");
      var param={orderNumber:row.orderNumber};
      this.$confirm("是否终止该订单")
        .then(_ => {
          stoporder(param)
          .then(res =>{
            console.log("进来了");
            this.tosearch();
            this.$message({
              showClose: true,
              message: "已关闭该订单",
              type: "success"
            });
          })
          .catch(err=>{
            this.$message({
              showClose: true,
              message: "请求失败，请稍后再试",
              type: "error"
            });
          })
        })
    },
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

