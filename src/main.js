// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'babel-polyfill'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import Qs from 'qs'

Vue.prototype.Qs = Qs;

import Yl from 'ylcookie'

Vue.prototype.Yl = Yl;

import Axios from 'axios'

Vue.prototype.Axios = Axios;

// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
  if (Yl.cookie('admin') || config.url === '/index.php/admin/login/login') {
    return config;
  } else {
    router.push('/')
  }
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


function timestampToTime(timestamp) {
  let date = new Date(timestamp * 1000);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return Y + M + D + h + m + s;
}

Vue.prototype.timestampToTime = timestampToTime;

Vue.use(iView);
Vue.config.productionTip = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
