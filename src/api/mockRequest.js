//对axios进行二次封装
import axios from 'axios';
//引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
//statrt:进度条开始， done：进度条结束





//1:利用axios对象的方法create，去创建一个axios实例
//2：request就是axios，只不过需要稍微配置一下
const requests = axios.create({
  //配置对象
  //基础路径
  baseURL: '/mock',
  timeout: 50000,
})



// 添加请求拦截器
requests.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //config：配置对象，对象里面有一个操作十分重要，header请求头
  //进度条开始动
  nprogress.start();
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
requests.interceptors.response.use(function (response) {

  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // 进度条结束
  nprogress.done();
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(new Error('faile'));
});



//对外暴露
export default requests;