import { reqGoodsInfo, reqOrAddUpdateShopCart } from "@/api";
// 封装游客临时的身份uuid的字符串，不能再变了
import { getUUID } from "@/utils/uuid_token.js"

const state = {
  goodInfo: {},
  uuid_token: getUUID()
};
const mutations = {
  GETGOODINFO(state, goodInfo) {
    state.goodInfo = goodInfo;
  },
  // GETADDORUPDATESHOPCART(state, )
};
const actions = {
  //获取产品信息的action
  async getGoodInfo({ commit }, skuId) {
    let result = await reqGoodsInfo(skuId);
    if (result.code == 200) {
      commit("GETGOODINFO", result.data)
    }
  },
  async getAddOrUpdateShopCart({ commit }, { skuId, skuNum }) {
    //加入购物车返回的解构
    // 加入购物车以后（发请求），前台将参数带给服务器
    // 服务器写入数据成功，并没有返回其他的数据，只是返回code==200,代表这次操作成功
    // 因为服务器没有返回其余数据，因此咱们不需要三连环存储数据
    let result = await reqOrAddUpdateShopCart(skuId, skuNum);
    if (result.code == 200) {
      return "ok";
    } else {
      //代表加入购物车失败
      return Promise.reject(new Error('fail'));
    }
  }
};
const getters = {
  categoryView(state) {
    return state.goodInfo.categoryView || {}
  },
  skuInfo(state) {
    return state.goodInfo.skuInfo || {}
  },
  spuSaleAttrList(state) {
    return state.goodInfo.spuSaleAttrList || []
  }
};


export default {
  state,
  mutations,
  actions,
  getters,
}