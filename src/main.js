import Vue from 'vue'
import App from './App.vue'
//三级联动组件---全局组件
import TypeNav from '@/components/TypeNav/index.vue';
//轮播图组件
import Carousel from '@/components/Carousel/index.vue';
//分页器组件
import Pagination from '@/components/Pagination/index.vue';
// 引入element-ui，并且将样式文件一并引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//引入懒加载和懒加载img资源
import VueLazyload from 'vue-lazyload';
import lazyimg from '@/assets/lazyimg.jpg'

//统一接口api文件夹里面全部请求函数
//统一引入
import * as API from '@/api';

// 第一个参数：全局组件的名字   第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav);
Vue.component(Carousel.name, Carousel);
Vue.component(Pagination.name, Pagination);
Vue.use(ElementUI)
Vue.use(VueLazyload, {
  // l懒加载默认图片
  loading: lazyimg
})


//引入仓库
import store from "@/store/index.js"
//引入路由
import router from '@/router'
Vue.config.productionTip = false

//引入mockServe.js --mock数据
import '@/mock/mockServe';
//引入swiper样式
import 'swiper/css/swiper.css'

//引入表单校验插件
import "@/plugins/validate.js";

new Vue({
  render: h => h(App),
  //注册路由：底下的写法KV一致省略V【router小写的】
  //注册路由信息：当这里书写router的时候，组件身上都拥有$route,$router属性
  router,
  //注册仓库：组件实例的身上多了一个属性$store属性
  store,
  // 这里是配置全局事件总线$bus，用于兄弟组件间的通信
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  }

}).$mount('#app')
