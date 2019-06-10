<template>
  <div class="HouseRoom-main-container">
    <div class="HouseRoom-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <div class="container-hotel">
          <el-form-item label="酒店">
            <el-select v-model="searchform.hotelid" filterable clearable>
              <el-option
                v-for="item in commitAllHotel"
                :key="item.id"
                :label="item.hotelName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              style="width:100px"
              @click="searchroom(searchform.hotelid)"
              >查询</el-button
            >
            <el-button
              type="primary"
              style="width:100px"
              :disabled="!canadd"
              @click="addRoom"
              >新增</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="HouseRoom-main-container-list">
      <el-table
        :data="tabledata"
        style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="table-expand">
                    <el-form-item label="最大入住成人数">
                        <span>{{ props.row.maxPeoples }}人</span>
                    </el-form-item>
                    <el-form-item label="网络连接">
                        <span>{{ optionnetwork[props.row.network].label }}</span>
                    </el-form-item>
                    <el-form-item label="无烟信息">
                        <span>{{ optionsmoke[props.row.smoke].label }}</span>
                    </el-form-item>
                    <el-form-item label="关键信息">
                        <span>{{ props.row.information }}</span>
                    </el-form-item>
                    <el-form-item label="床型">
                        <span v-html="props.row.showbedtype"></span>
                    </el-form-item>
                    <el-form-item label="房型设施">
                      <template>
                        <div v-for=" item in props.row.newfacilities" :key="item.prepend" class="flexrow" style="margin-bottom:8px">
                            <el-tag size="mini" style="margin:10px;">{{item.prepend}}</el-tag>
                            <span>{{item.value}}</span>
                        </div>
                      </template>
                        <!-- <span v-html="props.row.facilities"></span> -->
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>
        <el-table-column width="100" label="房型ID" prop="id" />
        <el-table-column width="170" label="房型名称" prop="roomName" />
        <el-table-column width="110" label="房间数量" prop="roomNum"/>
        <el-table-column width="110" label="楼层">
            <template slot-scope="scope">
                {{scope.row.location1}}-{{scope.row.location2}}层
            </template>
        </el-table-column>
        <el-table-column width="100" label="面积" prop="area">
            <template slot-scope="scope">
                {{scope.row.area}}m^2
            </template>
        </el-table-column>
        <el-table-column width="120" label="加床" >
            <template slot-scope="scope">
                {{ scope.row.addBed == 0 ? "不可加床" : "可加床" }}
            </template>
        </el-table-column>
        <el-table-column width="120" label="是否有窗">
            <template slot-scope="scope">
                {{ scope.row.window == 0 ? "无窗" : "有窗" }}
            </template>
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
      <el-dialog :visible.sync="roomdialogVisible" :title="title">
        <el-form
          ref="changeroom"
          :model="changeroom"
          label-width="120px"
          style="width:85%;margin:0 auto">
            <el-form-item width="80" label="房型ID" >
                <el-input v-model="changeroom.id" disabled style="width:130px"></el-input>
            </el-form-item>
            <el-form-item width="140" label="房型名称" >
                <el-input v-model="changeroom.roomName" style="width:220px"></el-input>
            </el-form-item>
            <el-form-item width="80" label="房间数量">
                <el-input v-model="changeroom.roomNum" type="number" style="width:130px"></el-input>
            </el-form-item>
            <el-form-item width="100" label="楼层">
                <el-input v-model="changeroom.location1" style="width:50px"></el-input>
                <span>到</span>
                <el-input v-model="changeroom.location2" style="width:50px"></el-input>
                <span>层</span>
            </el-form-item>
            <el-form-item width="100" label="面积">
                <el-input v-model="changeroom.area" type="number" style="width:90px;margin-right:5px"></el-input>
                <span>m^2</span>
            </el-form-item>
            <el-form-item width="100" label="床型">
                <!-- 床型相关 -->
                <template>
                  <el-form label-position="top" :inline="true" :model="bedtypeList" ref="bedtypeList" label-width="100px">
                      <div style="margin-bottom:5px" v-for='(item, index) in bedtypeList.domains' :key="item.key">
                        <el-form-item :prop="'domains.'+index+'.bedId'"
                          :rules="{
                            required: true, message: '床型必选', trigger: 'change'
                          }">
                          <el-cascader
                            clearable
                            filterable
                            separator="-"
                            :disabled="item.noexit==true?true:false" 
                            style="width:170px;margin-right:2px"
                            v-model="item.bedId"
                            :options="getbedoption">
                          </el-cascader>
                        </el-form-item>
                        <el-form-item label=""
                        :prop="'domains.'+index+'.number'" class=""
                        :rules="{
                          required: true, message: '数量必填', trigger: 'blur'
                        }">
                        <template>
                          <el-input :disabled="item.noexit==true?true:false" v-model="item.number" style="width:60px;" class="el-in-left-more" type="number"></el-input>
                          <span style="margin-right:5px">  张</span>
                        </template>
                        </el-form-item>
                        <el-form-item label="" :prop="'domains.'+index+'.width'" 
                        :rules="{
                          required: true, message: '床长必填', trigger: 'blur'
                        }">
                        <template>
                          <el-input :disabled="item.noexit==true?true:false" v-model="item.width" style="width:65px;" class="el-in-left-more"></el-input>
                          <span>  米</span>
                        </template>
                        </el-form-item>
                        <template v-if="title=='增加物理房型'">
                          <el-button v-if="index!=0" type="danger" style="margin-left:5px" icon="el-icon-delete" circle @click="deleteDomain(item, index)" size="small"></el-button>
                          <el-button v-if="index==0" type="primary" style="margin-left:5px" icon="el-icon-plus" circle @click="addDomain" size="small"></el-button>
                        </template>
                        <template v-if="title=='修改物理房型'">
                          <el-button  type="danger" style="margin-left:5px" icon="el-icon-delete" circle @click="deleteDomain(item, index)" size="small"></el-button>
                          <el-button v-if="index==0" type="primary" style="margin-left:5px" icon="el-icon-plus" circle @click="addDomain" size="small"></el-button>
                        </template>
                      </div>
                      </el-form>
                </template>
            </el-form-item>
            <el-form-item width="100" label="加床" >
                <el-select
                v-model="changeroom.addBed"
                placeholder="请选择是否可加床"
                style="width:180px;"
                >
                <el-option
                    v-for="item in optionsbed"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
                </el-select>
            </el-form-item>
            <el-form-item width="100" label="是否有窗">
                <el-select
                v-model="changeroom.window"
                placeholder="请选择是否有窗"
                style="width:180px;">
                <el-option
                    v-for="item in optionswindow"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
                </el-select>
            </el-form-item>
            <el-form-item label="最大入住成人数">
                <el-input v-model="changeroom.maxPeoples" type="number" style="width:130px"></el-input>
            </el-form-item>
            <el-form-item label="网络连接">
              <el-select
                v-model="changeroom.network"
                placeholder="请选择网络信息"
                style="width:180px;">
                <el-option
                    v-for="item in optionnetwork"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="无烟信息">
              <el-select
                v-model="changeroom.smoke"
                placeholder="请选择无烟信息"
                style="width:180px;">
                <el-option
                    v-for="item in optionsmoke"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="关键信息">
                <el-input v-model="changeroom.information" type="textarea" :autosize="{ minRows: 2, maxRows: 8}"></el-input>
            </el-form-item>
            <el-form-item label="房型设施">
                <template>
                  <!-- changeroom.facilities -->
                  <div v-for=" item in optionfacilities " :key="item.prepend" class="flexrow" style="margin-bottom:8px">
                      <el-tag class="facilitiestag" >{{item.prepend}}</el-tag>
                      <el-input v-model="item.value " type="textarea" :autosize="{ minRows: 2, maxRows: 8}">
                      </el-input>
                  </div>
                </template>
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
import { deleteById,findRoomBed,selectAllCities,selectHotelList,findRoomByHotelId,updataRoomByid,insertRoom} from "@/api/api.js";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "hotelRoom",
  data() {
    return {
        canadd:false,
        searchform:{
            hotelid:null
        },
        bedtypeList:{
          domains: [{roomid:0,key: 0,bedId:null,number:null,width:null}]
        },
        options:[
          {value:'大床',label:'大床',children:[{value:1,label:'圆床'},{value:2,label:'水床'}]},
          {value:2,label:'双床',children:[{value:3,label:'双人床'}]},
          {value:2,label:'单人床',children:[{value:5,label:'单人床'}]}
        ],
        tabledata:null,
        changeroom:{},
        roomdialogVisible:false,
        title:null,
        optionsbed: this.GLOBAL.addbedoption,
        optionswindow:this.GLOBAL.windowoption,
        optionnetwork:this.GLOBAL.networkoption,
        optionsmoke:this.GLOBAL.smokeoption,
        optionfacilities:this.GLOBAL.facilitiesoption,
    };
  },
  created: function() {
    findRoomBed({})
    .then(res => {
      this.$store.commit("room/commitAllBedOption", res.result);
    })
    // console.log(this.getbedoption);
    
  },
  mounted () {
    if(!this.$store.state.allHotelList){
      selectHotelList({})
        .then(res => {
          this.$store.commit("hotel/commitAllHotel", res.result);
        })
    }
  },
  computed:{
    ...mapGetters({
        getbedtypeid:'room/getbedtypeid',
        getbedoption:"room/getbedoption" //可选
      }),
    ...mapState({
      commitAllHotel: state => state.hotel.allHotelList,
    })
  },
  methods: {
  //查询区域
    searchroom(hotelid) {
      if (hotelid != null) {
          this.canadd=true;
          findRoomByHotelId({hotelId:hotelid})
            .then(res=>{
                var areaarray=[];
                var location=[];
                var showbedList=[];
                for(var i=0;i<res.result.length;i++){
                    areaarray=res.result[i].area.split('m');
                    location=res.result[i].location.split('-');
                    res.result[i].location1=location[0];
                    res.result[i].location2=location[1].split('层')[0];
                    res.result[i].area=areaarray[0];
                    for(var j=0;j<res.result[i].roomBedList.length;j++){
                        showbedList.push(res.result[i].roomBedList[j].bedName+","+res.result[i].roomBedList[j].number+"张,"+res.result[i].roomBedList[j].width+"米");                  
                    }
                    res.result[i].facilities=res.result[i].facilities.split("##");
                    res.result[i].newfacilities=this.optionfacilities;
                    for(var j=0;j<res.result[i].newfacilities.length;j++){
                      res.result[i].newfacilities[j].value=res.result[i].facilities[j];
                    }
                    res.result[i].showbedtype=(showbedList.length>0?showbedList.join("<br/>"):"暂无床型");
                    showbedList=[];
                    delete res.result[i]['gmtCreat'];
                    delete res.result[i]['gmtModified'];
                    // res.result[i].area=area[0]
                }
                this.tabledata=res.result
                console.log(this.tabledata);
            })
            .catch(err=>{
            })
      } else {
        this.$message({
          type: "warning",
          message: "请选择酒店!"
        });
      }
    },
    //新增物理房型
    addRoom(){
      this.title = "增加物理房型";
      this.optionfacilities=this.GLOBAL.facilitiesoption;
      this.bedtypeList.domains=[{}];
      this.changeroom = {};
      this.roomdialogVisible = true;
    },
    //修改物理房型
    change(index, row) {
      this.title = "修改物理房型";

      this.changeroom = row;
      for(var i=0;i<this.changeroom.facilities.length;i++){
        this.optionfacilities[i].value=this.changeroom.facilities[i];
      }
      var bedtype=null;
      var bedidlist=[];
      if(this.changeroom.roomBedList.length!=0){
        this.bedtypeList.domains=[];
      }else{
        this.bedtypeList.domains=[{}];
      }
      for(var j=0;j<this.changeroom.roomBedList.length;j++){
        bedtype=this.changeroom.roomBedList[j].bedId;
        if(bedtype>=1&&bedtype<=15){
          bedidlist=[0,bedtype];
        }else if(bedtype>=16&&bedtype<=20){
          bedidlist=[1,bedtype];
        }else if(bedtype>=21&&bedtype<=23){
          bedidlist=[2,bedtype];
        }else{
          bedidlist=[3,bedtype];
        }
        this.bedtypeList.domains.push({roomid:this.changeroom.roomBedList[j].roomId,key:j+1,bedId:bedidlist,number:this.changeroom.roomBedList[j].number,width:this.changeroom.roomBedList[j].width,canDelete:this.changeroom.roomBedList[j].canDelete,noexit:true,id:this.changeroom.roomBedList[j].id})
      }
      // console.log(this.bedtypeList.domains);
      this.roomdialogVisible = true;
    },
    //确定修改
    addapproval() {
      if(this.bedtypeList.domains[0].bedId==null){
        this.$alert('请添加床型', '提示', {
          confirmButtonText: '确定',
        })
      }else{
        var newroom = JSON.parse(JSON.stringify(this.changeroom));
        delete newroom['roomBedList'];
        delete newroom['newfacilities'];
        delete newroom['showbedtype'];
        newroom.location=newroom.location1+"-"+newroom.location2+"层";
        console.log(newroom);
        console.log(this.bedtypeList);
        var roomBeds=JSON.parse(JSON.stringify(this.bedtypeList.domains));
        var roomid=(newroom.id==null?0:newroom.id);
        var addBeds=[];
        for(var i=0;i<roomBeds.length;i++){
          delete roomBeds[i]['key'];
          delete roomBeds[i]['canDelete'];
          delete roomBeds[i]['value'];
          roomBeds[i].bedId=roomBeds[i].bedId[1];
          roomBeds[i].id=0;
          roomBeds[i].roomId=roomid;
          roomBeds[i].number=parseInt(roomBeds[i].number);
          roomBeds[i].width=parseFloat(roomBeds[i].width);
          if(roomBeds[i].noexit!=true){
            addBeds.push(roomBeds[i])
          }
        }
        var facilitiesArray=[];
        this.optionfacilities.forEach((v)=>{
          facilitiesArray.push(v.value)
        })
        newroom.facilities=facilitiesArray.join("##");
        newroom.roomBeds=addBeds;
        console.log(newroom);
        var addnewbed=JSON.parse(JSON.stringify(newroom.roomBeds))
        if(this.title=='修改物理房型'){
          console.log(newroom);
          updataRoomByid(newroom)
              .then(res=>{
                  if(res.message=="SUCCESS"){
                      this.$message({message: "修改成功!"});
                      this.searchroom(this.searchform.hotelid);
                      this.roomdialogVisible = false;
                      this.changeroom={};
                  }
              })
        }else{
            newroom.hotelId=this.searchform.hotelid;
            newroom.area=newroom.area+"m^2";
            insertRoom(newroom)
                .then(res=>{
                    if(res.message=="SUCCESS"){
                        this.$message({message: "新增成功!"});
                        this.searchroom(this.searchform.hotelid);
                        this.roomdialogVisible = false;
                        this.changeroom={};
                    }
                })
        }
      }
       
    },
    //添加床型
    addDomain () {
      var index = this.bedtypeList.domains.length
      if (index < 3) {
        this.bedtypeList.domains.push({
          value: '',
          key: Date.now()
        })
      }else{
        this.$alert('最多可添加3种床型', '提示', {
          confirmButtonText: '确定',
        })
      }
    },
    //删除房型
    deleteDomain (item, index) {
      console.log(item);
      if(item.canDelete==0||item.canDelete==null){
        if(item.canDelete==0){
          //原有可删除
          this.$confirm('是否删除该床型?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteById({id:item.id})
            .then(res=>{
              if(res.message=="SUCCESS"){
                this.index = this.bedtypeList.domains.indexOf(item);
                  if (this.bedtypeList.domains.length !== 1) {
                    this.bedtypeList.domains.splice(index, 1)
                  }else{
                    this.bedtypeList.domains=[{}]
                  }
                  this.searchroom(this.searchform.hotelid);
                  this.$message({
                    type: 'SUCCESS',
                    message: '删除成功'
                  });
              }
            })
            .catch(err=>{
                this.$message({
                  type: 'ERR',
                  message: '删除失败'
                }); 
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        }else{
          //新增删除
          this.index = this.bedtypeList.domains.indexOf(item);
          if (this.bedtypeList.domains.length !== 1) {
            this.bedtypeList.domains.splice(index, 1)
          }else{
            this.bedtypeList.domains=[{}]
          }
        }

      }else{
        
        this.$alert('该床型已绑定售卖房型，不能删除', '提示', {
          confirmButtonText: '确定',
        })
      }
    },
  }
};
</script>

<style lang="less" scoped>
.HouseRoom-main-container {
  width: 1000px;
  // width: 80%;
  margin: 30px auto;
  &-search {
    width: 100%;
    background-color: #f7f8f8;
    padding: 30px 0;
    .container-search-form {
      width: 52%;
      margin: 10px auto;
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
  &-list {
    margin-top: 40px;
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
            color:#99a9bf;
            // white-space: pre-wrap;
        }
    }
    .facilitiestag{
      width:90px;text-align:center;margin-right:5px
    }

  }
}
</style>
