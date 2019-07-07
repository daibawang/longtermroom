<template>
  <div class="HouseList-main-container">
    <div class="HouseList-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <div class="container-hotel">
          <el-form-item label="城市">
            <el-select
              v-model="searchform.cityName"
              filterable
              clearable
              style="width:160px"
            >
              <el-option
                v-for="item in cityoption"
                :key="item.id"
                :label="item.cityName"
                :value="item.cityName"
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
            <el-button type="success" style="width:100px" @click="searchroom"
              >查询</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="HouseList-main-container-hotellist">
      <div class="hotellist-item-view">
        <div class="hotellist-item" v-for="item in hotellist" :key="item.id">
          <span
            :class="selecthotel.id == item.id ? 'hotellist-item-select' : ''"
            @click="seehotel(item)"
            >{{ item.hotelName }}</span
          >
          <span
            class="hotellist-item-noshare"
            :class="item.saleStatus == 0 ? '' : 'show'"
            >[停售]</span
          >
        </div>
      </div>
      <div class="hotellist-item-pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          small
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="HouseList-main-container-hotelName" v-if="showsell">
      <span>{{ selecthotel.hotelName }}</span>
    </div>
    <div class="HouseList-main-container-list" v-if="showsell">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
          <div v-for="roomitem in tabledata" :key="roomitem.id" >
          <el-collapse-item :name="roomitem.id">
            <template slot="title">
              <div class="flexrow list-typeview">
                <span class="list-typeitem-name" >{{roomitem.roomName}}</span>
                <div class="list-typeitem">
                  <svg-icon
                      className="itemmargin"
                      icon-class="room1num"
                  />
                  <span>{{roomitem.roomNum}}间</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room2area"
                  />
                  <span>{{roomitem.area}}</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room3location"
                  />
                  <span>{{roomitem.location}}</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room4people"
                  />
                  <span>{{roomitem.maxPeoples}}人</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room5bed"
                  />
                  <span>{{roomitem.showbed}}</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room6add"
                  />
                  <span>{{optionsbed[roomitem.addBed].label}}</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room10window"
                  />
                  <span>{{optionswindow[roomitem.window].label}}</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room7wifi"
                  />
                  <span>{{optionnetwork[roomitem.network].label}}</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room8nosmoke"
                  />
                  <span>{{optionsmoke[roomitem.smoke].label}}</span>
                  <svg-icon
                      className="itemmargin"
                      icon-class="room9sell"
                      iconColor="#67C23A"
                  />
                  <span>{{roomitem.countNum==0?'未设置售卖房型':'已设置'+roomitem.countNum+'种售卖房型'}}</span>
                </div>
                <div class="list-typeitem-addsell" @click.stop @click="addsell(roomitem)">
                  <!-- <i class="el-icon-plus"></i> -->
                  <svg-icon
                      className="itemmargin"
                      icon-class="add"
                  />
                </div>
              </div>
            </template>
            <div class="flexcol list-sellroom-calendarview">
              <!-- {{roomitem.sellRoom}} -->
              <div class="flexrow " v-for="(sellitem,index) in roomitem.sellRoom" :key="index">
                <div class="flexcol calendar-item"> 
                  {{roomitem.roomName+"<"+optionmeal[sellitem.meal].label+"><"+optionremain[sellitem.roomType].label+"><"+getalllbedinfo[sellitem.bedType]+">"}}
                  <span>
                    房型ID:{{sellitem.id}}
                  </span>
                  <span>
                    状态:{{sellitem.offline==0?'上线':'下线'}}
                  </span>
                  <span>
                    押金:{{sellitem.deposit}}元
                  </span><span>
                    可入住人数:{{sellitem.peoples}}人
                  </span>
                  <el-button
                      style="width:90px;margin-top:5px"
                      type="primary"
                      size="mini"
                      plain
                      @click="changemoresellroom(roomitem.id,sellitem.id,roomitem.roomName)"
                      >修改
                  </el-button>
                  <el-button
                      style="width:90px;margin:5px 0 0"
                      :type="sellitem.offline==0?'danger':'success'"
                      size="mini"
                      plain
                      @click="changeSellOffline(sellitem.id,sellitem.offline)"
                      >{{sellitem.offline==0?'下线':'上线'}}
                  </el-button>
                </div>
                <div class="calendar-content">
                  <div class="calendar-content-monthselect">
                    <el-date-picker
                        size="small"
                        style="width:120px"
                        v-model="selectMonth"
                        type="month"
                        :picker-options="pickerOptions0"
                        value-format="yyyy-MM-dd"
                        placeholder="选择月">
                      </el-date-picker>
                  </div>
                  <el-calendar v-model="showmonth">
                      <template
                        slot="dateCell"
                        slot-scope="{date, data}">
                        <div :class="data.type=='current-month'?'content-nowmonthitem':'content-monthitem'" @click.stop @click="clickday(roomitem.roomNum,data,sellitem.id,roomitem.id,roomitem.roomName,sellitem.roomSellingDateList[data.day.substr(8,2)>'10'?data.day.substr(8,2):data.day.substr(9,1)])" >
                          <div v-if="data.type=='current-month'" class="nowday-item">
                            <!-- <div class="nowday-sell nowday-close">蔡{{sellitem.roomSellingDateList}}</div> -->
                            <!-- <div class="nowday-sell">{{sellitem.roomSellingDateList[data.day.substr(8,2)].sellingStage==1||ellitem.roomSellingDateList[data.day.substr(8,2)].sellingStage==null?'关':'开'}}</div> -->
                              <div  v-if="sellitem.roomSellingDateList!=null" @click.stop @click="changeroomsell(roomitem.id,data.day,sellitem.roomSellingDateList[data.day.substr(8,2)>'10'?data.day.substr(8,2):data.day.substr(9,1)])"  :class="sellitem.roomSellingDateList[data.day.substr(8,2)>'10'?data.day.substr(8,2):data.day.substr(9,1)].sellingStage==1?'nowday-sell':'nowday-close'">
                              {{sellitem.roomSellingDateList[data.day.substr(8,2).replace(/\b(0+)/gi,"")].sellingStage==1?'开':'关'}}
                              </div>
                            <div class="nowday-day">
                              {{data.day.substr(5,5)}}
                            </div>
                            <div :class="sellitem.roomSellingDateList[data.day.substr(8,2)>'10'?data.day.substr(8,2):data.day.substr(9,1)].isset==1?'nowday-count':'nowday-nocount'">
                              <svg-icon
                                  icon-class="money"
                              />{{sellitem.roomSellingDateList[data.day.substr(8,2).replace(/\b(0+)/gi,"")].price!=null?sellitem.roomSellingDateList[data.day.substr(8,2).replace(/\b(0+)/gi,"")].price:'暂无价格'}}
                            </div>
                            <div class="nowday-num">
                              <el-tooltip class="item"  placement="bottom-start">
                                  <div slot="content">总房量：{{sellitem.roomSellingDateList[data.day.substr(8,2).replace(/\b(0+)/gi,"")].num}}<br/>已售卖房量：{{sellitem.roomSellingDateList[data.day.substr(8,2).replace(/\b(0+)/gi,"")].soldNum}}<br/>库存售完是否自动关房：{{sellitem.roomSellingDateList[data.day.substr(8,2).replace(/\b(0+)/gi,"")].autoOff==1?'否':'是'}}</div>
                                  <span>{{sellitem.roomSellingDateList[data.day.substr(8,2).replace(/\b(0+)/gi,"")].soldNum}}/{{sellitem.roomSellingDateList[data.day.substr(8,2).replace(/\b(0+)/gi,"")].num}}</span>
                                </el-tooltip>
                            </div>
                              <!-- {{data.day}} -->
                          </div>
                        </div>
                        <!-- <p :class="data.isSelected ? 'is-selected' : ''">
                          {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
                        </p> -->
                      </template>
                    </el-calendar>
                </div>
              </div>
            </div>
          </el-collapse-item>
          </div>
      </el-collapse>
    </div>
    <el-dialog :visible.sync="roomdialogVisible" :title="title" class="HouseList-main-container-dialog">
        <el-form
          class="dialog-elitem" 
          ref="addsellroom"
          :model="addsellroom"
          label-width="120px"
          style="width:60%;margin:0 auto">
            <el-form-item  label="物理房型" >
              <template>
                <span class="dialog-name">{{addsellroominfo.roomName}}</span>
              </template>
            </el-form-item>
            <el-form-item  label="入住人数" >
              <el-select
                v-model="addsellroom.peoples"
                placeholder="请选择入住人数"
                style="width:180px;">
                <el-option
                    v-for="item in optionpeople"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item  label="餐食" >
              <el-select
                v-model="addsellroom.meal"
                placeholder="请选择餐食"
                style="width:180px;">
                <el-option
                    v-for="item in optionmeal"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item  label="床型" >
              <el-select
                v-model="addsellroom.bedType"
                placeholder="请选择床型"
                style="width:180px;">
                <el-option
                    v-for="item in sellroombedtype"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item  label="房型名称备注" >
              <el-select
                v-model="addsellroom.roomType"
                placeholder="请选择房型名称备注"
                style="width:180px;">
                <el-option
                    v-for="item in optionremain"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item  label="押金" >
              <el-input
                type="number"
                min=0
                v-model="addsellroom.deposit"
                placeholder="请输入押金金额"
                style="width:180px;">
              </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roomdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addapproval">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="sellroomdialogVisible" :title="selltitle" class="HouseList-main-container-dialog">
        <el-form
          class="dialog-elitem" 
          ref="sellroomchange"
          :model="sellroomchange"
          label-width="200px"
          style="width:60%;margin:0 auto">
            <el-form-item  label="售卖房型名称" >
              <template>
                <span class="dialog-name">{{sellroomchange.roomName}}</span>
              </template>
            </el-form-item>
            <el-form-item  label="修改日期" >
              <template>
                <span class="dialog-name">{{sellroomchange.sellingDate}}</span>
              </template>
            </el-form-item>
            <el-form-item  label="房态" >
              <el-radio v-model="sellroomchange.sellingStage" :label=1>开房</el-radio>
              <el-radio v-model="sellroomchange.sellingStage" :label=2>关房</el-radio>
            </el-form-item>
            <el-form-item  label="房价" >
              <el-input 
                type=number
                min=0
                v-model="sellroomchange.price"
                style="width:180px;">
              </el-input>
            </el-form-item>
            <el-form-item  label="售卖房间数量" >
              <el-input 
                v-model="sellroomchange.soldNum"
                style="width:180px;">
              </el-input>
            </el-form-item>
            <el-form-item  label="最晚确认时间" >
              <el-time-picker
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                v-model="sellroomchange.lastOrder"
                placeholder="选择最晚预定时间"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item  label="库存售完是否自动关房">
              <el-radio v-model="sellroomchange.autoOff" :label=0>是</el-radio>
              <el-radio v-model="sellroomchange.autoOff" :label=1>否</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sellroomdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sellroomaproval">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="addsellroomdialogVisible" :title="selltitle" class="HouseList-main-container-dialog">
        <el-form
          class="dialog-elitem" 
          ref="sellroomchange"
          :model="sellroomchange"
          label-width="200px"
          style="width:60%;margin:0 auto">
            <el-form-item  label="售卖房型名称" >
              <template>
                <span class="dialog-name">{{sellroomchange.roomName}}</span>
              </template>
            </el-form-item>
            <el-form-item  label="修改日期" >
              <template>
                <span class="dialog-name">{{sellroomchange.sellingDate}}</span>
              </template>
            </el-form-item>
            <el-form-item  label="房态" >
              <el-radio v-model="sellroomchange.sellingStage" :label=1>开房</el-radio>
              <el-radio v-model="sellroomchange.sellingStage" :label=2>关房</el-radio>
            </el-form-item>
            <el-form-item  label="房价" >
              <el-input 
                type=number
                min=0
                v-model="sellroomchange.price"
                style="width:180px;">
              </el-input>
            </el-form-item>
            <el-form-item  label="最晚确认时间" >
              <el-time-picker
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                v-model="sellroomchange.lastOrder"
                placeholder="选择最晚预定时间"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item  label="库存售完是否自动关房">
              <el-radio v-model="sellroomchange.autoOff" :label=0>是</el-radio>
              <el-radio v-model="sellroomchange.autoOff" :label=1>否</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addsellroomdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addsellroomaproval">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="moresellroomdialogVisible" :title="selltitle" class="HouseList-main-container-dialog">
        <el-form
          class="dialog-elitem" 
          ref="moresellroomchange"
          :model="moresellroomchange"
          label-width="200px"
          style="width:85%;margin:0 auto">
            <el-form-item  label="售卖房型名称" >
              <template>
                <span class="dialog-name">{{moresellroomchange.roomName}}</span>
              </template>
            </el-form-item>
            <el-form-item  label="修改日期" >
              <template>
                <el-date-picker
                  :picker-options="pickerOptions0"
                  v-model="moresellroomchange.sellingDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                <!-- <span class="dialog-name">{{moresellroomchange.sellingDate}}</span> -->
              </template>
            </el-form-item>
            <el-form-item  label="房态" >
              <el-radio v-model="moresellroomchange.sellingStage" :label=1>开房</el-radio>
              <el-radio v-model="moresellroomchange.sellingStage" :label=2>关房</el-radio>
            </el-form-item>
            <el-form-item  label="房价" >
              <el-input 
                v-model="moresellroomchange.price"
                style="width:180px;">
              </el-input>
            </el-form-item>
            <el-form-item  label="售卖房间数量" >
              <el-input 
                v-model="sellroomchange.soldNum"
                style="width:180px;">
              </el-input>
            </el-form-item>
            <el-form-item  label="最晚确认时间" >
              <el-time-picker
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                v-model="moresellroomchange.lastOrder"
                placeholder="选择最晚预定时间"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item  label="库存售完是否自动关房">
              <el-radio v-model="moresellroomchange.autoOff" :label=0>是</el-radio>
              <el-radio v-model="moresellroomchange.autoOff" :label=1>否</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="moresellroomdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="moresellroomaproval">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {shutUpRoomSellingDate,updatamoreSellingDate,shutUpRoomSelling,insertRoomSellingDate,updateRoomSellingDate,findRoomNoPage,selectSellRoom,insertSellRoom,findRoomByHotelId,selectHotelList,selecthotelname,selectAllCities,findRoomBed} from "@/api/api.js";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import {formatdate} from "@/assets/js/common.js";
export default {
  name: "hotelRoom",
  data() {
    return {
      activeNames:'',
      canadd: false,
      searchform: {
        cityName: null,
        hotelName: null
      },
      total: 0,
      pageSize: 8,
      tabledata: null,
      hotellist: [],
      cur_page: 1,
      showsell:false,
      selecthotel: {
        hotelName: "",
        id: null,
        lastOrder: "",
        saleStatus: 0
      },
      sellroombedtype:[],
      optionpeople:[],
      optionmeal:this.GLOBAL.mealoption,
      optionremain:this.GLOBAL.remainoption,
      optionsbed: this.GLOBAL.addbedoption,
      optionswindow:this.GLOBAL.windowoption,
      optionnetwork:this.GLOBAL.networkoption,
      optionsmoke:this.GLOBAL.smokeoption,
      optionfacilities:this.GLOBAL.facilitiesoption,
      //月份选择限制
      pickerOptions0:{
        disabledDate:(time) =>{
          return time.getTime() < new Date()
        }
      },
      roomdialogVisible:false,
      sellroomdialogVisible:false,
      addsellroomdialogVisible:false,
      moresellroomdialogVisible:false,
      title:null,
      addsellroominfo:{},
      addsellroom:{},
      calendardata:[],
      showmonth:new Date(),
      selectMonth:'',
      sellroomchange:{},
      moresellroomchange:{},
      selltitle:'修改售卖日期',
      today:''
    };
  },
  watch: {
    // data:'changecity'
    selectMonth(newMonth, oldMonth) {
      console.log("data:'changecity'");
      
      this.showmonth=new Date(Date.parse(newMonth))
    },
    showmonth(newMonth, oldMonth){
      if(newMonth!=oldMonth){
        var nowMonth=(newMonth.getMonth()+1)+'';
        this.selectMonth=newMonth.getFullYear()+"-"+nowMonth+"-01";
        nowMonth=nowMonth.padStart(2,"0");
        var uptime=newMonth.getFullYear()+"-"+nowMonth;
        // 
        this.updateSellDateInfo(this.activeNames,uptime);
      }
    }
  },
  created: function() {
    console.log(new Date());
    this.today=formatdate(new Date())
    this.searchroom('begin');
    selectHotelList({}).then(res => {
      this.$store.commit("hotel/commitAllHotel", res.result);
    });
    findRoomBed({})
    .then(res => {
      this.$store.commit("room/commitAllBedOption", res.result);
    })
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
        getalllbedinfo:'room/getalllbedinfo',
        getbedtypeid:'room/getbedtypeid',
        getbedoption:"room/getbedoption" //可选
    }),
    ...mapState({
      cityoption: state => state.hotel.cityoption,
      commitAllHotel: state => state.hotel.allHotelList
    })
  },
  methods: {
    //分页器
    handleCurrentChange(val) {
      this.cur_page = val;
      console.log("当前页" + this.cur_page);
      this.searchroom('search');
    },
    //查询区域
    searchroom(status) {
      var searchparm = JSON.parse(JSON.stringify(this.searchform));
      searchparm.page = this.cur_page;
      //过滤多条件查询参数t
      for (var attr in searchparm) {
        if (searchparm[attr] === null || searchparm[attr] === "") {
          // console.log(attr);
          delete searchparm[attr];
          continue;
        }
      }
      selecthotelname(searchparm)
        .then(res => {
          console.log(res);
          this.total = res.result.total;
          this.hotellist = res.result.list;
          if(status=='begin'){
            this.showsell=false;
          }else{
            this.seehotel(res.result.list[0]);
          }
        })
        .catch(err => {});
    },
    seehotel(item) {
      this.selecthotel = item;
      findRoomNoPage({hotelId:this.selecthotel.id})
        .then(res=>{
            this.activeNames='';//置空折叠面板选择
            var areaarray=[];
            var location=[];
            var showbedList=[];
            var roomlist = res.result;
            var sellroombedtype=[];
            for(var i=0;i<roomlist.length;i++){
                for(var j=0;j<roomlist[i].roomBedList.length;j++){
                    sellroombedtype.push({value:roomlist[i].roomBedList[j].bedId,label:roomlist[i].roomBedList[j].bedName});
                    showbedList.push(roomlist[i].roomBedList[j].bedName);                  
                }
                roomlist[i].showbed=(showbedList.length>0?showbedList.join("|"):"暂无床型");
                roomlist[i].sellroombedtype=sellroombedtype;
                roomlist[i].sellRoom=null;
                sellroombedtype=[];
                showbedList=[];
                // roomlist[i].area=area[0]
            }
            console.log("roomlist");
            console.log(roomlist);
            this.tabledata=roomlist;
            console.log(this.tabledata);
        })
        .catch(err=>{
        })
      this.showsell=true;
    },
    addsell(item){
      this.title="增加售卖房型";
      this.optionpeople=[];
      for(var i=0;i<item.maxPeoples;i++){
        this.optionpeople.push({value:i+1,label:i+1});
      }
      this.sellroombedtype=item.sellroombedtype;
      this.addsellroom={};
      this.addsellroominfo=item;
      this.roomdialogVisible=true;
      console.log(item)
    },
    //确认增加
    addapproval(){
      this.addsellroom.roomId=this.addsellroominfo.id;
      this.addsellroom.offline=0;
      insertSellRoom(this.addsellroom)
        .then(res=>{
          if(res.message=="SUCCESS"){
            this.seehotel(this.selecthotel);
            this.$message({
              type: "success",
              message: "新增售卖房型成功!"
            });
            this.addsellroom={};
            this.roomdialogVisible=false;
          }
        })
      console.log(this.addsellroom);
    },
  //查看售卖房型
    handleChange(val) {
      console.log("val");
      console.log(val);
      if(val!=''){
        //物理房型id
        var findroom=this.tabledata.find(
            item => item.id == val
        );
        console.log(findroom);
        if(findroom){
          if(findroom.sellRoom==null){
            var newMonth=new Date();
            var nowMonth=newMonth.getMonth()+1+'';
            this.updateSellDateInfo(val,newMonth.getFullYear()+"-"+nowMonth.padStart(2,"0"));
          }
        }
      }
    },
    //刷新日历
    updateSellDateInfo(roomid,monthdata){
      var findroom=this.tabledata.find(
            item => item.id == roomid
      );
      findroom.sellRoom={};
      console.log("刷新");
      var pram={};
      pram.roomId=roomid;
      pram.sellingDate=monthdata;
      selectSellRoom(pram)
        .then(res=>{
          var gettercalendar=Array(32).fill({isset:0,num:0,soldNum:0,price:null,sellingStage:2,soldNum:0,autoOff:0});
          // var gettercalendar=Array(32).fill({autoOff:0,num:0,price:null,sellingStage:2,soldNum:0,autoOff:0});
          var sellDate=[];
          for(var i=0;i<res.result.length;i++){
            if(res.result[i].roomSellingDateList.length>1){
              for(var j=0;j<res.result[i].roomSellingDateList.length;j++){
                sellDate=res.result[i].roomSellingDateList[j].sellingDate;
                res.result[i].roomSellingDateList[j].isset=1;
                sellDate=parseInt(sellDate.substr(8,2));
                gettercalendar[sellDate]=res.result[i].roomSellingDateList[j];
              }
            }
            res.result[i].roomSellingDateList=gettercalendar;
            gettercalendar=Array(32).fill({isset:0,num:0,soldNum:0,price:null,sellingStage:2,soldNum:0,autoOff:0});
          }
          console.log(res.result);
          findroom.sellRoom=res.result;
      })
    },
    //选择日期,修改售卖房型
    clickday(roomNum,date,wuliid,shoumaiid,roomName,sellitem){
      console.log(date);
      if(date.type=='current-month'&&date.day>this.today){
          this.sellroomchange={}
          if(sellitem.isset==0){
            //原来不存在，现在新增
            // this.sellroomchange={autoOff:0,id:0,price:null,roomSellingId:shoumaiid,sellingDate:date.day,sellingStage:1};
            this.sellroomchange={roomName:roomName,wuliid:wuliid,lastOrder:'00:00:00',price:null,roomSellingId:shoumaiid,sellingDate:date.day,sellingStage:1,num:roomNum,soldNum:0};
            this.addsellroomdialogVisible=true
          }else{
            this.sellroomchange=sellitem;
            this.sellroomchange.roomName=roomName;
            this.sellroomchange.wuliid=wuliid;
            this.sellroomdialogVisible=true;
          }
          console.log(this.sellroomchange);
      }else if(date.day<this.today){
        this.$confirm('已过日期不能修改');
      }else if(date.day == this.today){
        this.$confirm('当天信息不能修改');
      }
    },
    //修改售卖房型
    sellroomaproval(){
      var sellDate=JSON.parse(JSON.stringify(this.sellroomchange))
      delete sellDate['roomName'];
      delete sellDate['isset'];
      var parm={upids:[this.sellroomchange.id],roomSellingDate:sellDate};
      var uptime=this.sellroomchange.sellingDate.substr(0,7);
      if(this.sellroomchange.isset==1){
        //修改
        updateRoomSellingDate(parm)
          .then(res=>{
            if(res.message=="SUCCESS"){
              console.log("this.sellroomchange");
              console.log(this.sellroomchange);
              this.updateSellDateInfo(this.sellroomchange.wuliid,uptime);
              this.$message({
                type: "success",
                message: "修改售卖房型日期成功!"
              });
              this.sellroomdialogVisible=false;
            }
          })
      }else{
        //新增

      }
      // var parm={upids:[this.sellroomchange.id],roomSellingDate:}
      console.log(this.sellroomchange);
      
    },
    //新增售卖房型
    addsellroomaproval(){
      var sellDate=JSON.parse(JSON.stringify(this.sellroomchange))
      var uptime=this.sellroomchange.sellingDate.substr(0,7);
      console.log(sellDate);
      var parm={endDate:sellDate.sellingDate,roomSellingDate:sellDate,startDate:sellDate.sellingDate}
      insertRoomSellingDate(parm)
        .then(res=>{
            if(res.message=="SUCCESS"){
              this.updateSellDateInfo(this.sellroomchange.wuliid,uptime);
              this.$message({
                type: "success",
                message: "修改售卖房型日期成功!"
              });
              this.addsellroomdialogVisible=false;
            }
          })
    },
    //关闭单一房型
    changeroomsell(wuliid,day,sellitem){
      if(sellitem.id==null){
        this.$confirm("该日期未设置，不能开房");
      }else if(day<this.today){
        console.log(day);
        console.log(this.today);
        
        this.$confirm("已过日期不能设置");
      }else{
        var sellingStage=1;
        if(sellitem.sellingStage==1){
          sellingStage=2;
        }
        if(sellitem.price==0&&sellitem.sellingStage==1){
          this.$confirm("当前房价为0元，不能开房");
        }else{
          var parm={id:sellitem.id,sellingStage:sellingStage}
          shutUpRoomSellingDate(parm)
            .then(res=>{
              this.updateSellDateInfo(wuliid,day.substr(0,7));
            })
            .catch(err=>{

            })
        }
      }
      
    },
    //上下线房型
    changeSellOffline(roomid,offline){
      console.log(roomid);
      var changeoffline=null;
      var offlinetips='上线';
        if(findroom.sellRoom[0].offline==0){
          changeoffline=1;

        }else{
          changeoffline=0;
        }
      shutUpRoomSelling({offline:changeoffline,id:roomid})
        .then(res=>{
          if(res.message=="SUCCESS"){
            console.log();
            var newMonth=new Date();
            var nowMonth=newMonth.getMonth()+1+'';
            this.updateSellDateInfo(roomid,newMonth.getFullYear()+"-"+nowMonth.padStart(2,"0"));
            this.$message({
                type: "success",
                message: "上线成功!"
              });
          }
        })
        .catch(err =>{

        })
    },
    //批量修改
    changemoresellroom(roomid,roomSellingId,roomName){
      this.moresellroomchange={};
      // this.moresellroomchange=sellitem;
      this.moresellroomchange={roomid:roomid,sellingDate:'',roomName:roomName,roomSellingId:roomSellingId,lastOrder:'00:00:00',price:null,sellingStage:1,num:0,soldNum:0};
      console.log(this.moresellroomchange);
      this.moresellroomdialogVisible=true;
    },
    //确认批量修改
    moresellroomaproval(){
      console.log(this.moresellroomchange);
      var roomsell=JSON.parse(JSON.stringify(this.moresellroomchange));
      var pram = {startDate:this.moresellroomchange.sellingDate[0],endDate:this.moresellroomchange.sellingDate[1],roomSellingDate:{}}
      roomsell.id=0;
      var roomid=roomsell.roomid;
      delete roomsell.sellingDate;
      delete roomsell.roomName;
      delete roomsell.roomid;
      pram.roomSellingDate=roomsell;
      updatamoreSellingDate(pram)
        .then(res=>{
          console.log(res);
          if(res.message=='SUCCESS'){
            var changemonth=pram.startDate.substr(0,7);
            console.log(changemonth);
            this.updateSellDateInfo(roomid,changemonth);
            this.$message({
                type: "success",
                message: "修改成功!"
              });
            this.moresellroomdialogVisible=false;
          }
        })
        .catch(err=>{

        })
    }
  }
};
</script>

<style lang="less" scoped>
.HouseList-main-container {
  width: 1080px;
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
  &-hotellist {
    margin-top: 4px;
    width: 100%;
    background-color: #f7f8f8;
    padding: 10px 0;
    .hotellist-item-view {
      width: 90%;
      margin: 10px auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .hotellist-item {
        cursor: pointer;
        font-size: 14px;
        letter-spacing: 1px;
        line-height: 35px;
        width: 25%;
        &-select {
          color: #409eff;
        }
        &-noshare {
          margin-left: 3px;
          color: red;
          visibility: hidden;
        }
        .show {
          visibility: visible;
        }
      }
    }
    .hotellist-item-pagination {
      flex-direction: row-reverse;
      display: flex;
      padding-right: 10px;
      background-color: #f7f8f8 !important;
    }
  }
  &-hotelName {
    margin-top: 20px;
    font-size: 16px;
    letter-spacing: 2px;
    font-weight: bold;
    color: #409eff;
  }
  &-list {
    margin-top: 20px;
    width: 100%;
    font-size:16px;
    letter-spacing:1px;
    .list-typeitem-name{
      letter-spacing:2px;
      margin-left:20px;
    }
    .list-typeview{
      width:100%;
      position:relative;
      font-size: 15px;
      font-weight: bold;
      // line-height: 48px;
      align-items: center;
      .list-typeitem{
        width:83%;
        font-weight: 300;
        font-size: 13px;
        color: #99a9bf;
      }
    }
    .list-typeitem-addsell{
      position:absolute;
      right:13px;
      top:0;
      color:#409eff;
      font-size:17px;
      font-weight: 1000;
    }
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
      span {
        color: #99a9bf;
      }
    }
    .el-collapse-item:last-child{
      margin-bottom:0px;
    }
    .el-collapse-item /deep/ .el-collapse-item__header{
      line-height: 22px;
    }
    .list-sellroom-calendarview{
      width:96%;
      margin: 0 auto;
      line-height: 23px;
      .calendar-item{
        width:18%;
        font-size: 13px;
        letter-spacing: 2px;
        span{
          font-size: 12px;
          color: #99a9bf;
          letter-spacing: 3px;
        }
      }
      .calendar-content{
        width:81%;
        position: relative;
        .is-selected {
          color: #1989FA;
        }
        .el-calendar{
          border: 1px solid #EBEEF5;
          .content-nowmonthitem{
            padding: 1px;
            .nowday-item{
              position: relative;
              padding-top: 10px;
              text-align: center;
              .nowday-num{

              }
              .nowday-sell,.nowday-close{
                position: absolute;
                top:0px;
                right:0px;
                width: 20px;
                height: 20px;
                line-height: 20px;
                border-radius: 2px;
                text-align: center;
                font-size: 12px;
                border: 1px solid #409eff;
                background-color: #fff;
                color: #409eff;
              }
              .nowday-close{
                border: 1px solid #409eff;
                background-color: #fff;
                border: 1px solid red;
                color: red;
              }
              .nowday-nocount{
                color: #000;
              }
              .nowday-count{
                margin-top:2px;
                color: #FE6600;
                font-size:14px;
              }
              .nowday-day{
              }
            }
          }
          .content-monthitem{
            width: 100%;
            height: 100%;
            background-color: #EFEFEF;
          }

        }
        .el-calendar /deep/ .el-calendar-day{
            padding: 1px;
            height: 98px;
            
        }
        .el-calendar  /deep/ button:nth-child(1){
            display: none;
        }
        .el-calendar  /deep/ button:nth-child(2){
            border-radius: 5px;
            height: 32px;
        }
        .el-calendar  /deep/ button:nth-child(3){
            visibility: hidden;
            width:130px;
        }
        &-monthselect{
          position: absolute;
          top: 12px;
          right:20px;
        }
      }
    }
  }
  &-dialog{
     .dialog-elitem /deep/ .el-form-item__label{
        font-size: 16px ;
      }
      .dialog-elitem /deep/ .el-range-separator{
        padding:0;
      }
      .dialog-elitem /deep/ .el-range-input{
        width:32%;
      }
    .dialog-name{
      font-weight: bold;
    }
  }
}
</style>
