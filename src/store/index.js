import Vue from "vue";
import Vuex from "vuex"

//需要使用插件一次
Vue.use(Vuex);

//引入小仓库
import home from "./home/index.js"
import search from "./search/index.js"
import detail from "./detail/index.js"
import shopCart from "./shopCart/index.js"
import user from "./user/index.js"
import trade from "./trade/index.js"




//对外暴露store类的一个实例
export default new Vuex.Store({
  //实现vuex仓库模块式开发存储数据
  modules: {
    home, search, detail, shopCart, user, trade
  }
})