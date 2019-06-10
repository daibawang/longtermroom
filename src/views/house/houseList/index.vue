<template>
  <div class="HouseList-main-container">
    <div class="HouseList-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <div class="container-hotel">
          <el-form-item label="城市">
            <el-select v-model="searchform.cityName" filterable clearable style="width:160px">
              <el-option
                 v-for="item in cityoption"
                :key="item.id"
                :label="item.cityName"
                :value="item.cityName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="酒店">
            <el-select v-model="searchform.hotelName" filterable clearable>
              <el-option
                v-for="item in commitAllHotel"
                :key="item.id"
                :label="item.hotelName"
                :value="item.hotelName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              style="width:100px"
              @click="searchroom"
              >查询</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="HouseList-main-container-hotellist">
      <div class="hotellist-item-view">
        <div class="hotellist-item" 
          v-for="item in hotellist"
          :key="item.id"
          >
          <span :class="selecthotel.id==item.id?'hotellist-item-select':''" @click="seehotel(item)">{{item.hotelName}}</span>
          <span class="hotellist-item-noshare" :class="item.saleStatus==0?'show':''">[停售]</span>
        </div>
      </div>
      <div class="hotellist-item-pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          small
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="HouseList-main-container-hotelName">
      <span>{{selecthotel.hotelName}}</span>
    </div>
    <div class="HouseList-main-container-list">
      <el-collapse accordion @change="handleChange">
        <el-collapse-item name="1" >
          <template slot="title">
            <div class="flexrow">
              <span>嘉宾轩大床房</span>
            </div>
            一致性 Consistency<i class="header-icon el-icon-info"></i>
          </template>
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item >
        <el-collapse-item title="反馈 Feedback" name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item >
        <el-collapse-item title="效率 Efficiency" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
        <el-collapse-item title="可控 Controllability" name="4">
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { selectAllCities,selectHotelList,selecthotelname} from "@/api/api.js";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "hotelRoom",
  data() {
    return {
        canadd:false,
        searchform:{
            cityName:null,
            hotelName:null
        },
        total:0,
        pageSize:8,
        tabledata:null,
        hotellist:[],
        cur_page:1,
        selecthotel:{hotelName: "北京康莱德酒店",id: 1,lastOrder: "00:25:00",saleStatus: 0}
    };
  },
  created: function() {
      this.searchroom();
      selectHotelList({})
        .then(res => {
          this.$store.commit("hotel/commitAllHotel", res.result);
        })
  },
  mounted () {
    if (!this.$store.state.cityoption) {
      selectAllCities({})
        .then(res => {
            this.$store.commit("hotel/commitCityOption", res.cities);
          })
    }
  },
  computed:{
    ...mapState({
      cityoption: state => state.hotel.cityoption,
      commitAllHotel: state => state.hotel.allHotelList,
    })
  },
  methods: {
    handleChange(val) {
        console.log(val);
      },
    //分页器
    handleCurrentChange(val){
      this.cur_page=val;
      console.log("当前页"+this.cur_page);
      this.searchroom();
    },
  //查询区域
    searchroom() {
      var searchparm=JSON.parse(JSON.stringify(this.searchform))
      searchparm.page=this.cur_page;
       //过滤多条件查询参数t
      for(var attr in searchparm){
        if(searchparm[attr] === null||searchparm[attr] === ''){
          // console.log(attr);
          delete searchparm[attr];
          continue; 
        }
      }
      selecthotelname(searchparm)
        .then(res=>{
          console.log(res);
          this.total=res.result.total;
          this.hotellist=res.result.list;
        })
        .catch(err =>{

        })
    },
    seehotel(item){
      this.selecthotel=item;
    }
  }
};
</script>

<style lang="less" scoped>
.HouseList-main-container {
  width: 1000px;
  // width: 80%;
  margin: 30px auto;
  &-search {
    width: 100%;
    background-color: #f7f8f8;
    padding: 20px 0;
    .container-search-form {
      width: 65%;
      margin: 5px auto;
      .container-hotel,
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
  &-hotellist{
    margin-top: 4px;
    width: 100%;
    background-color: #f7f8f8;
    padding: 10px 0;
      .hotellist-item-view{
        width: 90%;
        margin:10px auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .hotellist-item{
          cursor: pointer;
          font-size: 14px;
          letter-spacing: 1px;
          line-height: 35px;
          width:25%;
          &-select{
            color: #409EFF;
          }
          &-noshare{
            margin-left: 3px;
            color: red;
            Visibility:hidden;
          }
          .show{
            Visibility:visible;
          }
        }
      }
      .hotellist-item-pagination{
        flex-direction: row-reverse;
        display: flex;
        padding-right: 10px;
        background-color: #f7f8f8 !important;
      }
  }
  &-hotelName{
    margin-top: 20px;
    font-size: 16px;
    letter-spacing: 2px;
    font-weight: bold;
    color: #409EFF;
  }
  &-list {
    margin-top: 20px;
    width: 100%;
    .table-expand {
        font-size: 0;
    }
    .table-expand label {
        width: 100px;
        color: #000000;
    }
    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
        span{
            color:#99a9bf
        }
    }

  }
}
</style>
