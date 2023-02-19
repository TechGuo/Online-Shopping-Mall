<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">x</i>
            </li>
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTrademark">x</i>
            </li>
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">x</i>
            </li>
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">x</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a
                    >综合<span
                      v-show="isOne"
                      class="iconfont"
                      :class="{ 'icon-up': isAsc, 'icon-downswing': isDesc }"
                    ></span
                  ></a>
                </li>
                <li :class="{ active: !isOne }" @click="changeOrder('2')">
                  <a
                    >价格<span
                      v-show="!isOne"
                      class="iconfont"
                      :class="{ 'icon-up': isAsc, 'icon-downswing': isDesc }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由跳转的时候不能忘记带上id -->
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="3"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapState } from "vuex";

import SearchSelector from "./SearchSelector/SearchSelector";
export default {
  name: "Search",

  components: {
    SearchSelector,
  },
  data() {
    return {
      searchParams: {
        category1Id: "", //一级分类ID
        category2Id: "", //二级分类ID

        category3Id: "", //三级分类ID

        categoryName: "", //分类名字
        keyword: "", //关键字
        order: "1:desc", //排序方式
        pageNo: 1, //当前页码
        pageSize: 50, //当前页展示数量
        props: [], //平台售卖属性才操作带的参数
        trademark: "", //品牌
      },
    };
  },
  computed: {
    ///mapGetters里面的写法：传递的数组，因为getters计算是没有划分模块【home,search】
    ...mapGetters(["goodsList"]),
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    ...mapState({
      total: (state) => state.search.searchList.total,
    }),
  },
  methods: {
    //向服务器发送请求获取search模块数据（根据参数不同返回不同的数据进行展示）
    //把这次请求封装成一个函数：当需要时进行调用就可
    getData() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    removeCategoryName() {
      // 这里是对面包屑中categoryName进行删除操作
      // 需要将123id也要进行重置,这里重置有性能更优的操作,也就是将相应的字段变为undefined,意味着当前字段不会带给服务器.
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getData();
      //路由也是需要进行跳转,这里就是自己跳自己
      if (this.$route.params) {
        this.$router.push({ name: "Search", params: this.$route.params });
      } else {
        this.$router.push({ name: "Search" });
      }
    },
    removeKeyword() {
      // 这里涉及到一点组件通信（兄弟组件间数据的通信）的内容，目的是为了消除搜索栏中的搜索内容，也即是当消除关键字面包屑时，同时清空搜索框
      this.searchParams.keyword = undefined;
      // this.getData();
      this.$bus.$emit("clear"); //通知兄弟组件Header清除关键字
      if (this.$route.query) {
        this.$router.push({ name: "Search", query: this.$route.query });
        // console.log("query存在")
      } else {
        this.$router.push({ name: "Search" });
        // console.log("query不存在")
      }
    },
    removeTrademark() {
      this.searchParams.trademark = undefined;
      this.getData();
    },
    removeAttr(index) {
      this.searchParams.props.splice(index, 1);
      this.getData();
    },
    trademarkInfo(trademark) {
      //整理品牌字段的参数  “ID：品牌名称”
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      this.getData();
    },
    attrInfo(attr, attrValue) {
      //收集平台属性的地方
      // console.log(attrValue, attr);
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      //这里要考虑数组的去重，不然同一个属性会无限的添加
      if (this.searchParams.props.indexOf(prop) == -1) {
        this.searchParams.props.push(prop);
      }
      this.getData();
    },
    changeOrder(flag) {
      // flag是用于区分是综合还是价格的参数
      // flag形参：是一个标记，代表用户点击的是综合（1）价格（2）【用户点击的时候传递进来的】
      let originOrder = this.searchParams.order;
      //这里获取到的是最开始的状态
      let originFlag = this.searchParams.order.split(":")[0];
      let originSort = this.searchParams.order.split(":")[1];
      //准备一个新的order属性值
      let newOrder = "";
      //下面是主要的逻辑进行点击切换
      if (flag == originFlag) {
        newOrder = `${flag}:${originSort == "desc" ? "asc" : "desc"}`;
      } else {
        newOrder = `${flag}:${"desc"}`;
      }
      //将上面新的order赋予searchParams
      this.searchParams.order = newOrder;
      this.searchParams.pageNo = 1; //这里是保证每次排序后页面回归到第一页
      this.getData();
    },
    getPageNo(pageNo) {
      //获取当前第几页
      this.searchParams.pageNo = pageNo;
      this.getData();
    },
  },

  //当组件挂载完毕之前执行一次【先与mounted之前】
  beforeMount() {
    //在法送请求之前， 把接口需要传递的参数，进行整理（在给服务器发送请求之前，把参数整理好，服务器就会返回查询的数据）
    // 这里用到了es6的新增语法： 合并对象。 Object.assign
    Object.assign(this.searchParams, this.$route.query, this.$route.params); //这里的$route.query,this.$route.params前者是发送的请求
  },
  mounted() {
    this.getData(); //在发请求之前带给服务器参数【searchParams参数发生变化有数值带给服务器】
  },
  //watch是用来数据监听：监听组件实例身上的属性值变化
  watch: {
    //这里思路是对上面的路由进行监听，当路由发生变化就重新更新searchParams的参数并进一步更新页面数据
    $route(newValue, oldValue) {
      //下面是重新整合参数的变化，然后根据参数变化去更新数据
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      this.getData();
      // 下面是把前三个ID项进行置空，放置条件没有清除，下次搜索仍然带有上次搜索的前置条件
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>