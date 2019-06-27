<script>
const starimg = [
  "",
  "http://www.istuadmission.com/zip/plstar1.png",
  "http://www.istuadmission.com/zip/plstar2.png",
  "http://www.istuadmission.com/zip/plstar3.png",
  "http://www.istuadmission.com/zip/plstar4.png",
  "http://www.istuadmission.com/zip/plstar5.png"
];
const mealoption=[
  { value: 0, label: "不定" },
  { value: 1, label: "无早" },
  { value: 2, label: "含早" },
  { value: 3, label: "早+晚餐" },
  { value: 4, label: "早+午餐" },
  { value: 5, label: "早+午+晚餐" },
  { value: 6, label: "晚餐" },
  { value: 7, label: "午餐" },
  { value: 8, label: "午+晚餐" }
];

const remainoption=[
  { value: 0, label: "无" },
  { value: 1, label: "今日特价" },
  { value: 2, label: "特价大促销" },
  { value: 3, label: "特惠专享" },
  { value: 4, label: "特惠" },
  { value: 5, label: "升级特惠" },
  { value: 6, label: "特惠房" },
  { value: 7, label: "限量特价" },
  { value: 8, label: "全日特价" },
  { value: 9, label: "超值特惠" },
  { value: 10, label: "今日特惠" },
  { value: 11, label: "特别促销" },
  { value: 12, label: "特惠价" },
  { value: 13, label: "促销" },
  { value: 14, label: "特惠促销" },
  { value: 15, label: "特价" },
  { value: 16, label: "特价促销" },
  { value: 17, label: "限量特惠" },
  { value: 18, label: "限量特惠" },
  { value: 19, label: "特价房" },
];

const addbedoption = [
  { value: 0, label: "不可加床" },
  { value: 1, label: "免费加床" },
  { value: 2, label: "收费加床" }
];

const networkoption = [
  { value: 0, label: "全部免费" },
  { value: 1, label: "全部收费" },
  { value: 2, label: "部分免费" },
  { value: 3, label: "部分收费" }
];

const windowoption = [
  { value: 0, label: "无窗" },
  { value: 1, label: "有窗" },
  { value: 2, label: "部分有窗" }
];

const smokeoption = [
  { value: 0, label: "可吸烟" },
  { value: 1, label: "禁烟" },
  { value: 2, label: "部分客房可吸烟" }
];

const facilitiesoption = [
  {
    prepend: "便利设施",
    value:
      "多种规格电源插座、单一规格电源插座、220V电压插座、110V电压插座、遮光窗帘、自动窗帘、房内保险箱、书桌、沙发、坐卧两用长沙发、备用床具、床具:鸭绒被、床具:毯子或被子、电子秤、闹钟、针线包、衣柜/衣橱、熨衣设备、电风扇、空调、暖气、开夜床、房间内高速上网、客房WIFI覆盖免费"
  },
  {
    prepend: "媒体科技",
    value: "国内长途电话、国际长途电话、电话、有线频道、卫星频道、液晶电视机"
  },
  {
    prepend: "食品饮品",
    value:
      "免费瓶装水、咖啡机、烤箱、电热水壶、咖啡壶/,茶壶、迷你吧、小冰箱、用餐区、厨房、厨房用具、微波炉、洗碗机"
  },
  {
    prepend: "浴室",
    value:
      "免费洗漱用品(,6样以上)、24小时热水、浴缸、桑拿、淋浴、独立淋浴间、吹风机、拖鞋、浴衣、浴室化妆放大镜、洗浴间电视、洗浴间电话"
  },
  {
    prepend: "室外景观",
    value: "城景、湖景、花园景、地标景、享有风景"
  },
  {
    prepend: "其他",
    value:
      "行政酒廊、唤醒服务、欢迎礼品、语音留言、免费报纸、更衣室、连通房、私人入口"
  }
];
const orderoption=[
  { value: 0, label: "未支付" },
  { value: 1, label: "已支付" },
  { value: 2, label: "退订中" },
  { value: 3, label: "退款中" },
  { value: 4, label: "离店中" },
  { value: 5, label: "已关闭" }
]
export default {
  starimg,
  addbedoption,
  networkoption,
  windowoption,
  smokeoption,
  facilitiesoption,
  mealoption,
  remainoption,
  orderoption
};
</script>
