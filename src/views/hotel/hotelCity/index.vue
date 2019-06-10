<template>
  <div class="CityAdmin-main-container">
    <div class="CityAdmin-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <div class="container-city">
          <el-form-item label="城市">
            <el-select v-model="searchform.city" clearable>
              <el-option
                v-for="item in cityoption"
                :key="item.id"
                :label="item.cityName"
                :value="item.id">
              </el-option>
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
        v-if="areafromshow">
        <div class="container-area">
          <el-form-item label="区域">
            <div style="width: 450px;">
              <template >
                <el-tag
                  :key="tags.areaName"
                  v-for="tags in searchinfo.dynamicTags"
                  :closable="!areaabled"
                  :disable-transitions="true"
                  @close="handleClose1(tags)">
                  {{tags.areaName}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible1"
                  v-model="inputValue1"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm1"
                  @blur="handleInputConfirm1"
                >
                </el-input>
                <el-button :disabled="areaabled" v-else class="button-new-tag" size="small" @click="showInput1">+ 新增区域</el-button>
              </template>
            </div>

          </el-form-item>
        </div>
          <el-form-item style="float:right;margin-right:20px">
            <el-button
              round
              size="small"
              type="info"
              style="width:100px"
              @click="areasure()"
              v-if="!areaabled"
              >保存</el-button
            >
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { selectAllCities,insertAreas,selectCityAreaByCityId,deleteAreaByAreaId} from "@/api/api.js";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "hotelCity",
  data() {
    return {
      CityAreaList:null, //区域列表
      searchinfo:{
          keyword:null,
          dynamicTags:[],
          deleteid:[],
          addinfo:[]
      },
      inputValue1:'',
      inputVisible1:false,
      admin: true,
      areaabled: true,
      areafromshow: false,
      searchform: {
        city: null,
      },
      areaform: {},
      value: ["旅游区"]
    };
  },
  created: function() {},
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
    })
  },
  methods: {
  //查询区域
    searcharea(cityid) {
      if (cityid != null) {
        selectCityAreaByCityId({cityId:cityid})
          .then(res =>{
            console.log(res);
            if(res.message=="SUCCESS"){
              this.searchinfo.dynamicTags=res.citieAreas[0].areas;
              console.log(this.searchinfo.dynamicTags);
              
              this.admin = false;
              this.areafromshow = true;
            }
          })
      } else {
        this.$message({
          type: "warning",
          message: "请选择城市!"
        });
      }
      console.log(cityid);
      console.log(this.value);
    },
    handleClose1(tag) {
      console.log("tags")
      console.log(tag);
      console.log(this.searchinfo.dynamicTags)
      if(tag.hotelId==0){
        this.searchinfo.dynamicTags.splice(this.searchinfo.dynamicTags.findIndex((v) => {return v.areaName==tag.areaName}),1);
        if(tag.id!=0){
          console.log("删除原来"+tag.id)
          this.searchinfo.deleteid.push(tag.id);
        }else{
          console.log("删除新增"+tag.areaName)
          console.log(this.searchinfo.addinfo)
          this.searchinfo.addinfo.splice(this.searchinfo.addinfo.findIndex((v) => {return v.areaName==tag.areaName}),1);
          console.log(this.searchinfo.addinfo)
        }
      }else{
        this.$alert('该区域已经绑定酒店，暂不支持删除操作', '提示', {
          confirmButtonText: '确定',
          })
      }
      // console.log(this.searchinfo.deleteid)
    },
    showInput1() {
      this.inputVisible1 = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm1() {
      let Value1={};
        Value1.areaName= this.inputValue1;
        Value1.id= 0;
        Value1.hotelId=0;
      if (this.inputValue1) {
        if(this.searchinfo.dynamicTags.findIndex(v =>{return v.areaName==this.inputValue1})!=-1){
          this.$alert('该区域存在，请添加其他区域', '提示', {
            confirmButtonText: '确定',
          })
        }else{
          this.searchinfo.dynamicTags.push(Value1);
          this.searchinfo.addinfo.push(Value1);
        }
      }
      this.inputVisible1 = false;
      this.inputValue1 = '';
    },
    areasure() {
      this.areaabled = true;
      // console.log("this.searchinfo.deleteid");
      // console.log(this.searchinfo.deleteid);
      // console.log("this.searchinfo.addinfo");
      // console.log(this.searchinfo.addinfo);
      var addarea={areas:this.searchinfo.addinfo,cityId:this.searchform.city}
      var deletearea={areaIds:this.searchinfo.deleteid,cityId:this.searchform.city}
      deleteAreaByAreaId(deletearea)
        .then(res=>{
          if(res.message=="SUCCESS"){
            insertAreas(addarea)
            .then(res=>{
              if(res.message=="SUCCESS"){
                this.searchinfo.addinfo=[];
                this.searchinfo.deleteid=[];
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
              }
            })
          }
        })
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
          .el-form-item{
            .el-form-item__content{
              .el-tag{
                margin-right:10px;
                height: 35px;
                line-height: 35px;
              }
            }
          .input-new-tag{
            display: block;
            position: relative;
          }
        }

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
