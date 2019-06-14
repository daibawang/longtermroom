//分装请求接口
import {
  get,
  post,
  put,
  put_json,
  _delete,
  post_json,
  post_jsonheader,
  _delete_stringfty
} from "./request";
//登陆
export const login = login => post("api/auth/login", login);
//上传
export const upload = upload => post("album/uploadAlbum", upload);

//酒店模块

//查询城市区域信息
export const selectAllCityAreas = nodata =>
  get("cityAndArea/selectAllCityAreas", nodata);

//取得所有城市信息
export const selectAllCities = nodata =>
  get("cityAndArea/selectAllCities", nodata);

//为城市设置区域
export const insertAreas = areas => post_json("cityAndArea/insertAreas", areas);

//根据城市id查询城市区域信息(带是否挂有酒店)
export const selectCityAreaByCityId = nodata =>
  get("cityAndArea/selectCityAreaByCityId", nodata);

//新增酒店

export const insertHotel = hotelparams => post("hotel/insert", hotelparams);
//更新酒店
export const updateByPrimaryKey = hotelparams =>
  put("hotel/updateByPrimaryKey", hotelparams);

//id 查询酒店
export const selectHotelapi = selectparams =>
  get("hotel/selectHotelByMany", selectparams);
//查询所有酒店id和name
export const selectHotelList = selectno =>
  get("hotel/selectHotelIdAndNames", selectno);

//酒店id查所属区域
export const selectHotelareaapi = selectparams =>
  get("hotelArea/selectAreaIdByHotelId", selectparams);

//插入酒店区域信息
export const insertHotelArea = insertparams =>
  post_json("hotelArea/insertHotelArea2", insertparams);

//删除图集
export const deleteAlbumapi = deleteparams =>
  _delete("album/deleteAlbumById", deleteparams);

  //删除房型图集
export const deleteRoomImgapi = deleteparams =>
  _delete("album/deleteRoomAlbumById", deleteparams);

// 酒店id查找图集
export const selectAlbums = selectAlbums =>
  get("album/selectAlbums", selectAlbums);
//房型id查找图集
export const selectRoomImg = selectRoom =>
  get("album/selectRoomAlbums",selectRoom)

//查询所有床型信息
export const findRoomBed = selectRoom =>
  post("bed/selectBedCategory", selectRoom);
//如果床型下面没有绑定售卖房型则进行删除一条床型信息
export const deleteById = deleteById =>
  _delete_stringfty("room/deleteById", deleteById);

//根据酒店id查询物理房型list
export const findRoomByHotelId = selectRoom =>
  get("room/selectRoomByHotelId", selectRoom);
  
//根据酒店id查询物理房型信息以及售卖房型数量
export const findRoomNoPage = selectRoom =>
get("room/selectRoomByHotelIdAndCount",selectRoom)

//根据id修改物理房型
export const updataRoomByid = newRoom =>
  put_json("room/updateByPrimaryKey", newRoom);

//新增一条物理房型
export const insertRoom = newRoom => post_json("room/insertRoom", newRoom);

//查询所有品牌列表
export const selectBrands = selectpram =>
  get("brand/selectAllBrands", selectpram);

//不定条件查询品牌
export const selectBrandByMany = selectpram =>
  get("brand/selectBrandByMany", selectpram);

//更新品牌信息
export const updateBrand = updatepram => put("brand/updateBrand", updatepram);

//新增品牌信息
export const insertBrand = insertpram => post("brand/insertBrand", insertpram);

//根据城市，酒店名称查询酒店列表（酒店id，酒店名称，售卖状态）
export const selecthotelname = selecthotelname =>
  get("hotel/selectSaleAndIdNameByCityAndHotelName", selecthotelname);

//无酒店绑定的区域请求删除，根据区域id
export const deleteAreaByAreaId = deleteAreaByAreaId =>
  _delete("cityAndArea/deleteAreaByAreaId", deleteAreaByAreaId);

//插入一条售卖房型信息
export const insertSellRoom = insertRoom =>
  post("roomSelling/insert", insertRoom);

//
export const selectSellRoom = selectpram =>
  get("room/selectRoomSellingAndDates", selectpram)


//修改售卖房型日期
export const updateRoomSellingDate = selectpram =>
put_json("roomSelling/updateRoomSellingDate", selectpram)

//修改（新增）房日期
export const insertRoomSellingDate=inserparm =>
post_json("roomSelling/insertRoomSellingDate",inserparm)