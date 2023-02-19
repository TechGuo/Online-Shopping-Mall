import store from "@/store/index.js"

export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: 'Home',
    path: '/home',
    component: () => import("@/pages/Home/index.vue"),
    meta: {
      show: true
    }
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import("@/pages/Login/index.vue"),
    meta: {
      show: false
    },
    beforeEnter: (to, from, next) => { // 路由独享守卫
      // 如果还没有登陆, 放行
      if (!store.state.user.userInfo.name) {

        next()
      } else {
        // 如果已经登陆, 跳转到首页
        next('/')
      }
    }
  },
  {
    name: 'Register',
    path: '/register',
    component: () => import("@/pages/Register/index.vue"),
    meta: {
      show: false
    }
  },
  {
    name: 'Search',
    path: '/search/:keyword?',
    component: () => import("@/pages/Search/index.vue"),
    meta: {
      show: true
    }
  },
  {
    name: 'Detail',
    path: '/detail/:skuid',
    component: () => import("@/pages/Detail/index.vue"),
    meta: {
      show: true
    }
  },
  {
    name: 'AddCartSuccess',
    path: '/addCartSuccess',
    component: () => import("@/pages/AddCartSuccess/index.vue"),
    meta: {
      show: true
    }
  },
  {
    name: 'ShopCart',
    path: '/shopCart',
    component: () => import("@/pages/ShopCart/index.vue"),
    meta: {
      show: true
    }
  },
  {
    name: 'Trade',
    path: '/trade',
    component: () => import("@/pages/Trade/index.vue"),
    meta: {
      show: true
    },
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      if (from.path == '/shopcart') {
        next();
      } else {
        next(false)
      }
    }
  },
  {
    name: 'Pay',
    path: '/pay',
    component: () => import("@/pages/Pay/index.vue"),
    meta: {
      show: true
    },
    // 将query参数映射成props传递给路由组件
    props: route => ({ orderId: route.query.orderId }),

    /* 只能从交易界面, 才能跳转到支付界面 */
    beforeEnter(to, from, next) {
      if (from.path === '/trade') {
        next()
      } else {
        next('/trade')
      }
    }
  },
  {
    name: 'PaySuccess',
    path: '/paysuccess',
    component: () => import("@/pages/PaySuccess/index.vue"),
    meta: {
      show: true
    }
  },
  {
    name: 'Center',
    path: '/center',
    component: () => import("@/pages/Center/index.vue"),
    meta: {
      show: true
    },
    children: [
      {
        path: '/center',
        redirect: 'center/myOrder'
      },
      {
        name: 'MyOrder',
        // 二级路由不写 /  如果写就写全见下个二级路由组件
        path: 'myOrder',
        component: () => import("@/pages/Center/myOrder/index.vue")
      },
      {
        name: 'GroupOrder',
        path: '/center/groupOrder',
        component: () => import("@/pages/Center/groupOrder/index.vue")
      },
    ]
  },
]