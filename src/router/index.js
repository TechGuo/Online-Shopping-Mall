//配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes.js'
import store from "@/store/index.js"
//使用插件
Vue.use(VueRouter);

//先把vueRouter原型对象的push，先保存一份
let originPush = VueRouter.prototype.push;
let origionReplace = VueRouter.prototype.replace;
//重写push|replace
//第一个参数：告诉原来push方法，你往哪里跳转（传递哪些参数）
// 第二个参数：成功的回调
// 第三个参数:失败的回调
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    //call||apply区别
    // 相同点：都可以调用函数依次，都可以篡改函数的上下文一次
    // 不同点：call与apply传递参数：call传递参数用逗号隔开，apply方法执行，传递数组
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(this, location, () => { }, () => { });
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    //call||apply区别
    // 相同点：都可以调用函数依次，都可以篡改函数的上下文一次
    // 不同点：call与apply传递参数：call传递参数用逗号隔开，apply方法执行，传递数组
    origionReplace.call(this, location, resolve, reject);
  } else {
    origionReplace.call(this, location, () => { }, () => { });
  }
}

let router = new VueRouter({
  mode: 'history',
  //配置路由
  routes,
  //监听页面的滚动行为
  scrollBehavior(to, from, savePosition) {
    return { y: 0 };
  }
})

router.beforeEach(async (to, from, next) => {
  //to:可以获取到你跳转到那个路由信息
  // from:可以获取到你从哪个路由而来的信息
  // next：放行函数 next() next(path)放行到指令路由
  //获得token
  // next();
  let token = store.state.user.token
  let name = store.state.user.userInfo.name
  console.log(token, name)
  // 进行判断
  if (token) {
    // 用户已经登录了，还想去登录界面是不被允许的
    if (to.path == "/login" || to.path == '/register') {
      next('/home');
    } else {
      // 登录去的不是login而是其他的路由页面
      // 如果用户名已经有了,就是证明页面的数据没有丢失
      if (name) {
        next();
      } else {
        // 拥有token ， 但是没有页面数据
        //判断路由是不是从login进行跳转，如果是，则放行
        // 如果没有用户信息，也就是比如刷新页面，获取前往另一个路由页面时，没有name数据的情况
        try {
          await store.dispatch('getUserInfo')
          next();
        } catch (error) {
          // token 失效了获取不到用户信息，需要重新登录时才会来到这里
          // 清除token，并返回到登录页面
          await store.dispatch('userLogout');
          next('/login');
        }
      }
    }
  } else {
    //未登录：不能去交易相关、不能去支付相关【pay|paysuccess】、不能去个人中心
    //未登录去上面这些路由-----登录
    let toPath = to.path;
    if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
      //把未登录的时候向去而没有去成的信息，存储于地址栏中【路由】
      next('/login?redirect=' + toPath);
    } else {
      //去的不是上面这些路由（home|search|shopCart）---放行
      next();
    }
  }




})

//配置路由
export default router



