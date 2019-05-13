<template>
  <div class="HotelList-main-container">
    <div class="HotelList-main-container-search">
      <el-form :inline="true" :model="searchform" class="container-search-form">
        <el-form-item label="城市区域">
          <el-cascader
            v-model="searchform.area_id"
            :options="arealist"
            :clearable="true"
            separator=" "
            change-on-select
          />
        </el-form-item>
        <el-form-item label="酒店名称">
          <el-input v-model="searchform.hotel_name"></el-input>
        </el-form-item>
        <el-form-item label="酒店ID">
          <el-input v-model="searchform.id" type="number"></el-input>
        </el-form-item>
        <el-form-item label="售卖状态">
          <el-select
            v-model="searchform.sale_status"
            placeholder="请选择售卖状态"
          >
            <el-option label="在售" value="0"></el-option>
            <el-option label="停售" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="width:100px">查询酒店</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100px" @click="toadd"
            >新增酒店</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="HotelList-main-container-list">
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="80" label="酒店ID" prop="id" />
        <el-table-column width="280" label="酒店名称" prop="hotel_name" />
        <el-table-column width="80" label="城市" prop="city" />
        <!-- <el-table-column
                    width="80"
                    label="区域"
                    prop="area"/> -->
        <el-table-column width="80" label="品牌">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <el-form ref="from" :model="changetime" label-width="50px">
                <el-form-item label="品牌:">
                  <el-input v-model="scope.row.brand"></el-input>
                </el-form-item>
              </el-form>
              <div slot="reference" style="cursor: pointer;">
                {{ scope.row.brand }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="150" label="星级">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <!-- <div class="score-popover">
                              <div v-for="(item,index) in score" :key="index">
                                <img :src="item.src" id="">
                              </div>
                          </div> -->
              <el-form ref="from" :model="changetime" label-width="50px">
                <el-form-item label="星级:">
                  <el-select
                    v-model="scope.row.star"
                    placeholder="请选择"
                    style="width:100px;"
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
              </el-form>
              <el-rate
                slot="reference"
                v-model="scope.row.star"
                disabled
              ></el-rate>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="90" label="售卖状态">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  @click="scope.row.sale = 1"
                  >在售</el-button
                >
                <el-button type="danger" size="mini" @click="scope.row.sale = 0"
                  >停售</el-button
                >
              </div>
              <div slot="reference" style="cursor: pointer;">
                {{ scope.row.sale == 0 ? "停售" : "在售" }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="110" label="最晚预订时间">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>时间: {{ scope.row.last_order }}</p>
              <el-button
                @click="setorder(scope.$index, scope.row)"
                :type="
                  scope.row.last_order_status == '未设置' ? 'info' : 'primary'
                "
                slot="reference"
                plain
                size="small"
              >
                {{ scope.row.last_order_status }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="120" label="最晚确定时间">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>时间: {{ scope.row.last_confirm }}</p>
              <el-button
                @click="setorder(scope.$index, scope.row)"
                :type="
                  scope.row.last_confirm_status == '未设置' ? 'info' : 'primary'
                "
                slot="reference"
                plain
                size="small"
              >
                {{ scope.row.last_order_status }}
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              style="margin-left:7px"
              size="small"
              type="success"
              @click="handleSee(scope.$index, scope.row)"
              >查看</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="handleAdmin(scope.$index, scope.row)"
              >管理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
              v-model="changetime.last_order"
              placeholder="选择最晚预定时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="最晚确定时间:">
            <el-time-picker
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              v-model="changetime.last_confirm"
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
      <el-dialog :visible.sync="dialogFormVisible" :title="title">
        <el-form
          ref="from"
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
          <el-form-item label="酒店名称">
            <el-input v-model="changeinfoall.hotel_name"></el-input>
          </el-form-item>
          <el-form-item label="城市">
            <el-select
              v-model="changeinfoall.city"
              placeholder="请选择"
              style="width:130px;"
            >
              <el-option
                v-for="item in optionscity"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域" v-if="!addhotel">
            <template
              style="display:flex;display-direction:row"
              v-if="changehotel"
            >
              <el-checkbox-group v-model="changeinfoall.checkedarea">
                <el-checkbox
                  v-for="city in changeinfoall.area"
                  :label="city"
                  :key="city"
                >
                  {{ city }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
          <el-form-item label="品牌">
            <el-select v-model="changeinfoall.brand" placeholder="请选择">
              <el-option
                v-for="item in optionsbrand"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="星级">
            <el-rate
              :texts="texts"
              v-model="changeinfoall.star"
              style="margin-top:10px;"
            ></el-rate>
          </el-form-item>
          <el-form-item label="售卖状态">
            <el-select
              v-model="changeinfoall.sale"
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
              v-model="changeinfoall.last_order"
              placeholder="选择最晚预定时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="最晚确定时间">
            <el-time-picker
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              v-model="changeinfoall.last_confirm"
              placeholder="选择最晚确定时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="添加酒店图集">
            <!-- <el-upload
              class="upload-demo"
              :action="params.action"
              :before-upload="onBeforeUpload"
              :before-remove="beforeRemove"
              :on-success="
                (res, file) => {
                  return onSuccess(res, file, 15);
                }
              "
              :limit="10"
              :data="params.data1"
              :on-preview="handlePreview"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="mini" type="primary"
                >点击上传<i class="el-icon-upload el-icon-right"></i
              ></el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">删除酒店</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addapproval">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { selectAllCities } from "@/api/api.js";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import myRouter from "@/router/router";
export default {
  name: "hotelList",
  // 城市 区域 名称 id 售卖状态
  data() {
    return {
      timedialogVisible: false,
      dialogFormVisible: false,
      changetime: {},
      changeinfoall: { hotel_name: "" },
      title: null,
      addhotel: false,
      changehotel: false,
      params: {
        action: this.$URL + "/UploadHandleServlet",
        data1: { username: "", kind: "0", filename: "", packname: "" }
      },
      fileList: [], // fileList: [{name: '', url: ''}],
      score: Array(5).fill({ src: "@/assets/img/star.png" }),
      texts: ["一星", "二星", "三星", "四星", "五星"],
      options: [
        {
          value: 1,
          label: "1星"
        },
        {
          value: 2,
          label: "2星"
        },
        {
          value: 3,
          label: "3星"
        },
        {
          value: 4,
          label: "4星"
        },
        {
          value: 5,
          label: "5星"
        }
      ],
      options2: [
        {
          value: 1,
          label: "停售"
        },
        {
          value: 2,
          label: "在售"
        }
      ],
      optionscity: [
        {
          value: 1,
          label: "沈阳"
        },
        {
          value: 2,
          label: "长春"
        }
      ],
      optionsarea: [
        {
          value: 1,
          label: "商业区"
        },
        {
          value: 2,
          label: "行政区"
        }
      ],
      optionsbrand: [
        {
          value: 1,
          label: "品牌一"
        },
        {
          value: 2,
          label: "品牌二"
        }
      ],
      arealist: this.GLOBAL.arealist,
      searchform: {
        id: null,
        hotel_name: null,
        area_id: null,
        sale_status: null,
        options: [
          {
            value: "161116511",
            label: 1
          }
        ]
      },
      tableData: [
        {
          last_confirm_status: "未设置",
          last_confirm: "09:06:01",
          last_order_status: "未设置",
          last_order: "09:06:01",
          sale: 1,
          star: 1,
          starimg: this.GLOBAL.starimg[1],
          brand: "君悦",
          checkedarea: ["商业区"],
          area: ["商业区", "行政区", "旅游区"],
          hotel_name: "沈阳君悦酒店(Grand Hyatt Shenyang) ",
          id: "1",
          city: "沈阳"
        },
        {
          last_confirm_status: "已设置",
          last_confirm: "21:00",
          last_order_status: "已设置",
          last_order: "23:00",
          sale: 1,
          star: 1,
          starimg: this.GLOBAL.starimg[2],
          brand: "凯悦",
          checkedarea: ["商业区"],
          area: ["商业区", "行政区", "旅游区"],
          hotel_name: "长春凯悦酒店(Hyatt Regency Changchun)",
          id: "2",
          city: "长春"
        }
      ]
    };
  },
  created: function() {
    console.log(this.score);

    // selectAllCities({})
    // .then(res => {
    //       console.log(res);
    //     })
    // .catch(err => {
    //     console.log(err);
    // });
  },
  methods: {
    toadd() {
      this.dialogFormVisible = true;
      this.addhotel = true;
      this.changehotel = false;
      this.changehotel = {};
      this.title = "新增酒店";
    },
    setorder(index, row) {
      console.log();
      this.timedialogVisible = true;
      this.changetime = row;
    },
    suretime() {
      this.timedialogVisible = false;
      console.log(this.changetime);
    },
    addapproval() {},
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleAdmin(index, row) {
      this.dialogFormVisible = true;
      this.title = "修改酒店";
      this.addhotel = false;
      this.changehotel = true;
      this.changeinfoall = row;
    },
    handleSee(index,row){
      
    },
    handleSelectionChange() {},
    //图集上传操作
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
  .score-popover {
    display: flex;
    flex-direction: row;
    img {
      width: 20px;
    }
  }
}
</style>
