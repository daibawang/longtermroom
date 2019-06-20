<template>
  <div class="HotelList-main-container">
    <div class="HotelList-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <el-form-item label="城市区域">
          <el-select
            v-model="searchform.city_id"
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
        <el-form-item label="酒店名称">
          <el-input v-model="searchform.hotel_name"></el-input>
        </el-form-item>
        <el-form-item label="酒店ID">
          <el-input v-model="searchform.hotel_id" type="number"></el-input>
        </el-form-item>
        <el-form-item label="售卖状态">
          <el-select
            clearable
            v-model="searchform.sale_status"
            placeholder="请选择售卖状态"
          >
            <el-option label="在售" value="0"></el-option>
            <el-option label="停售" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="width:100px" @click="tosearch"
            >查询酒店</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100px" @click="toadd"
            >新增酒店</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="HotelList-main-container-list">
      <el-table ref="multipleTable" :data="tableData" style="width: 100%">
        <el-table-column width="90" label="酒店ID" prop="id" />
        <el-table-column width="250" label="酒店名称" prop="hotelName" />
        <el-table-column width="100" label="城市" prop="city.cityName" />
        <!-- <el-table-column
                    width="80"
                    label="区域"
                    prop="area"/> -->
        <el-table-column width="120" label="品牌" prop="brand.brandName">
        </el-table-column>
        <el-table-column width="150" label="星级">
          <template slot-scope="scope">
            <el-rate slot="reference" v-model="scope.row.star" disabled>
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column width="100" label="售卖状态">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  @click="uploadhotel(scope.row, 0)"
                  >在售</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="uploadhotel(scope.row, 1)"
                  >停售</el-button
                >
              </div>
              <div slot="reference" style="cursor: pointer;">
                {{ scope.row.saleStatus == 0 ? "在售" : "停售" }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="110" label="最晚预订时间">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>时间: {{ scope.row.lastOrder }}</p>
              <el-button
                @click="setorder(scope.$index, scope.row)"
                :type="scope.row.lastOrder == '00:00:00' ? 'info' : 'primary'"
                slot="reference"
                plain
                size="small"
              >
                {{ scope.row.lastOrder == "00:00:00" ? "未设置" : "已设置" }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="120" label="最晚确定时间">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>时间: {{ scope.row.lastConfirm }}</p>
              <el-button
                @click="setorder(scope.$index, scope.row)"
                :type="scope.row.lastConfirm == '00:00:00' ? 'info' : 'primary'"
                slot="reference"
                plain
                size="small"
              >
                {{ scope.row.lastConfirm == "00:00:00" ? "未设置" : "已设置" }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleAdmin(scope.$index, scope.row)"
              >管理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="HotelList-main-container-pagination">
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
      <!-- 时间弹出框 -->
      <el-dialog
        title="最晚预订/确定时间设置"
        :visible.sync="timedialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form ref="from" :model="changetime" label-width="120px">
          <el-form-item label="最晚预定时间:">
            <el-time-picker
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              v-model="changetime.lastOrder"
              placeholder="选择最晚预定时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="最晚确定时间:">
            <el-time-picker
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              v-model="changetime.lastConfirm"
              placeholder="选择最晚确定时间"
            >
            </el-time-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="timedialogVisible = false">取消</el-button>
          <el-button type="primary" @click="suretime()">确 定</el-button>
        </span>
      </el-dialog>
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
                v-for="item in cityoption"
                :key="item.id"
                :label="item.cityName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域" required>
            <template style="display:flex;display-direction:row">
              <dir v-if="changecity!=null&&childMenu.length==0">该城市暂未绑定区域</dir>
              <el-checkbox-group v-model="checkedEquipments">
                <el-checkbox
                  v-for="cityarear in childMenu"
                  :label="cityarear.id"
                  :key="cityarear.areaName"
                >
                  {{ cityarear.areaName }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
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
              v-model="changeinfoall.lastOrder"
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
      <!-- 图集管理 -->
      <el-dialog :visible.sync="hotelimgVisible">
        <div class="img-show-view">
          <div class="img-show-item" v-for="url in urls" :key="url.id">
            <!-- <span class="demonstration">{{ fit }}</span> -->
            <span class="delete-icon" @click="deleteimg(url.id)"
              ><i class="el-icon-error"></i
            ></span>
            <el-image
              style="width: 210px; height: 100px"
              :src="url.url"
              fit="fit"
            >
              <div
                slot="placeholder"
                style="width: 210px; height: 100px;text-align:center;line-height: 100px"
              >
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </div>
          <div class="img-show-btn">
            <i class="el-icon-plus" @click="show = true"></i>
          </div>
        </div>
      </el-dialog>
      <!-- 裁剪组件 -->
      <my-upload
        field="pic"
        @crop-upload-success="cropUploadSuccess"
        v-model="show"
        :width="width"
        :height="height"
        :url="uploadUrl"
        :noCircle="true"
        :noSquare="noSquare"
        :params="params"
        :headers="myHeader"
        :maxSize="maxSize"
        img-format="png"
      >
      </my-upload>
    </div>
  </div>
</template>
<script>
import Qs from "qs";
import {
  insertHotel,
  insertHotelArea,
  selectAlbums,
  selectBrands,
  selectAllCities,
  selectHotelapi,
  updateByPrimaryKey,
  selectHotelareaapi,
  deleteAlbumapi,
  selectAllCityAreas
} from "@/api/api.js";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { listAssign } from "@/assets/js/common.js";
import { getCookie } from "@/assets/js/cookie.js";
// import myRouter from "@/router/router";
import myUpload from "vue-image-crop-upload";
// import { stat } from 'fs';
// import { log } from 'util';
export default {
  name: "hotelList",
  components: {
    "my-upload": myUpload
  },
  data() {
    return {
      searchform: {
        hotel_id: null,
        city_id: null,
        hotel_name: null,
        area_id: null,
        sale_status: null
      },
      timedialogVisible: false, //时间dialog
      dialogFormVisible: false, //修改，增加dialog
      hotelimgVisible: false, //图集dialog
      tableData: [], //酒店list
      total: null, //总条数
      pageSize: 4, //每页显示数量，后台确定
      cur_page: 1, //当前页
      changecity: null, //管理的城市id,用于数据监听
      checkedEquipments: [], //多选框修改后的checked项（即要传到后台的变更数据）
      saveEquipments: [], //
      childMenu: [], //该城市可选区域
      savecity: null, //选择管理的酒店所在的城市
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
  computed: {
    ...mapGetters({
      // textPlus: "hotel/getCityOption"
      getbrandoption: "hotel/getbrandoption" //可选品牌
    }),
    ...mapState({
      cityoption: state => state.hotel.cityoption,
      commitCityArea: state => state.hotel.commitCityArea
    })
  },
  watch: {
    // data:'changecity'
    changecity(newName, oldName) {
      // console.log(this.changecity + newName);

      if (newName != null) {
        console.log("修改了newNAME");
        if(this.changeinfoall.city!=null){
          if (newName == this.changeinfoall.city.id) {
            console.log("原来城市");
            this.checkedEquipments = this.saveEquipments;
          } else {
            this.checkedEquipments = [];
          }
        }
        console.log(this.CityAreaList);
        this.childMenu = this.CityAreaList.find(
          item => item.id == newName
        ).areas;
        // this.CityAreaList.find(item=>item.id==this.changeinfoall.city.id).areas;
        console.log(this.childMenu);
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
    //查询酒店
    tosearch() {
      console.log("tosearch重新加载");

      var searchparm = JSON.parse(JSON.stringify(this.searchform));
      //过滤多条件查询参数t
      for (var attr in searchparm) {
        if (searchparm[attr] === null || searchparm[attr] === "") {
          // console.log(attr);
          delete searchparm[attr];
          continue;
        }
      }
      searchparm.page = this.cur_page;
      selectHotelapi(searchparm)
        .then(res => {
          // console.log(res);
          console.log("重新加载selectHotelapi");
          this.tableData = res.result.list;
          this.total = res.result.total;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].star = parseInt(this.tableData[i].star);
            this.tableData[i].lastConfirm =
              this.tableData[i].lastConfirm == null
                ? "00:00:00"
                : this.tableData[i].lastConfirm;
            this.tableData[i].lastOrder =
              this.tableData[i].lastOrder == null
                ? "00:00:00"
                : this.tableData[i].lastOrder;
          }
          // console.log(this.tableData);
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
        lastOrder: this.changetime.lastOrder
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
    //更新区域
    updateArea(hotelid, areaids) {
      // console.log("调用了更新区域");
      var newarea = [...new Set(areaids)];
      // console.log("areaids");
      // console.log([...new Set(areaids)]);
      insertHotelArea({ hotel_id: hotelid, area_ids: newarea })
        .then(res => {
          if (res.message == "SUCCESS") {
            console.log("1111111");
            return true;
          }
        })
        .catch(err => {
          return false;
        });
    },
    //修改酒店信息
    async updataapproval(changeinfoall) {
      // console.log("this.changeinfoall.city.id"+this.changeinfoall.city.id);
      // console.log("this.changecity"+this.changecity);
      // console.log("this.checkedEquipments");
      // console.log(this.checkedEquipments);
      // console.log("this.saveEquipments");
      // console.log(this.saveEquipments);
      if (this.checkedEquipments.length != 0) {
        var newhotelinfo = {
          hotelName: "",
          brandId: null,
          saleStatus: null,
          lastOrder: null,
          lastConfirm: null,
          star: null,
          address: null,
          telephone: null,
          introduce: null,
          remain: null,
          id: null
        };
        listAssign(newhotelinfo, this.changeinfoall);
        let updateKey = await updateByPrimaryKey(newhotelinfo);
        if (updateKey.message == "SUCCESS") {
          let issuccess = null;
          if (
            !(
              this.changeinfoall.city.id == this.changecity &&
              this.checkedEquipments == this.saveEquipments
            )
          ) {
            //更改了城市区域
            // console.log("更改了城市区域");
            var newarea = [...new Set(this.checkedEquipments)];
            issuccess = await insertHotelArea({
              hotel_id: this.changeinfoall.id,
              area_ids: newarea
            });
          }
          if (issuccess == null || issuccess.message == "SUCCESS") {
            this.tosearch();
            this.$message("修改成功", "SUCCESS");
            this.changecity = null;
            this.changeinfoall = { hotel_name: "" };
            this.dialogFormVisible = false;
          } else {
            this.$message("修改失败", "ERRO");
          }
        }
      } else {
        this.$confirm("请选择区域信息");
      }
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
            lastOrder: null,
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
    //管理操作
    handleAdmin(index, row) {
      console.log("saveEquipments");
      console.log(this.checkedEquipments);
      this.changeinfoall = JSON.parse(JSON.stringify(row));
      // console.log(this.changeinfoall);
      this.params.hotelId = this.changeinfoall.id + "";
      this.savecity = this.changeinfoall.city.id;
      this.childMenu = [];
      this.saveEquipments = [];
      this.checkedEquipments = []; //已选中区域
      this.changecity = this.changeinfoall.city.id; //城市id
      //该城市可选区域  childMenu
      // console.log(this.changeinfoall.city.id)
      // console.log("可选区域");
      // console.log(this.changeinfoall.city.id)
      // console.log(this.childMenu);

      //请求 ->得到所属区域selectHotelareaapi
      selectHotelareaapi({ hotelId: this.changeinfoall.id })
        .then(res => {
          var newchecked = [];
          for (var i = 0; i < res.result.length; i++) {
            newchecked[i] = res.result[i].areaId;
          }
          this.checkedEquipments = newchecked;
          this.saveEquipments = newchecked;
          // this.childMenu=this.CityAreaList.find(item=>item.id==this.changeinfoall.city.id).areas;
          console.log("请求后");
          console.log(this.saveEquipments);
          this.childMenu = this.CityAreaList.find(
            item => item.id == this.changeinfoall.city.id
          ).areas;
          //加载图片
          this.loadingimg(this.params.hotelId);
          this.addhotel = false;
          this.changehotel = true;
          this.title = "修改酒店";
          this.dialogFormVisible = true;
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "请求失败，请稍后再试",
            type: "error"
          });
        });
    },
    //新增酒店时添加图集方法
    uploadnewimg(hotelId) {
      this.hotelimgVisible = true;
      this.params.hotelId = parseInt(hotelId);
    },
    //更新图片
    async loadingimg(qhotelId) {
      // console.log("调用了loadingimg");
      var param = { hotelId: qhotelId };
      selectAlbums(param)
        .then(res => {
          this.urls = res.result;
          for (var j = 0; j < this.urls.length; j++) {
            this.urls[j].url = "apis/image/" + this.urls[j].url;
          }
        })
        .catch(err => {});
    },
    //图集上传操作
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePreview(file) {
    //   console.log(file);
    // },
    //图集删除
    deleteimg(imgid) {
      var deletepram = { id: parseInt(imgid) };
      // console.log(deletepram);
      this.$confirm("是否删除该酒店图片?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log("确定删除");
          deleteAlbumapi(deletepram)
            .then(res => {
              this.loadingimg(this.param.hotelId);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(err => {});
        })
        .catch(() => {
          // console.log("已取消删除");
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //裁剪相关操作
    // 图片截取后调用，用于获取图片
    // getPicFunc (data) {
    //   console.log(data)
    // },
    // 图片上传成功后执行函数
    // successFunc (data) {
    //   console.log(data)
    // },
    //显示裁剪组件
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
.HotelList-main-container {
  width: 1150px;
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
