// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate,{Validator} from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import App from './App'
import router from './router'
import './lib/jquery-vender.js'
import 'jquery-confirm'

import 'bootstrap'
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min'
import 'slimscroll/lib/slimscroll'
import 'admin-lte'
import 'datatables.net-bs'
import 'xlsx/dist/xlsx'
import 'bootstrap-fileinput/js/fileinput.min'
import 'bootstrap-fileinput/themes/fa/theme.js'
import 'bootstrap-fileinput/js/locales/zh'
import 'sockjs-client/dist/sockjs.min'
import 'stompjs/lib/stomp'


import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/_all-skins.min.css'
import 'datatables.net-bs/css/dataTables.bootstrap.min.css'
import 'jquery-confirm/css/jquery-confirm.css'
import 'bootstrap-fileinput/css/fileinput.min.css'
import axios from 'axios'
// import $ from "jquery";

Validator.localize('zh_CN',zh_CN);
Vue.use(VeeValidate);
// var instance = axios.create({baseURL:'http://localhost:8184/'});
// var instance = axios.create({baseURL:'http://120.27.130.193:8184/'});
// var instance = axios.create({baseURL:'http://120.27.130.193:8184/'});
// var instance = axios.create({baseURL:'http://120.27.130.193:8188/'});

// var url = 'http://120.27.130.193:8188/';
var url = 'http://47.94.234.28:8188/';
// var url = 'http://localhost:8188/'
var instance = axios.create({baseURL:url});
var login_instance = axios.create({baseURL:url});


//拦截器获得数据，如果失败处理消息提示
//此处不能获得token，在starter中设置的头数据的token
instance.interceptors.response.use(({data})=>{
  if(data.status==1000){
    return data;
  }else{
    alert(data.msg);
  }
});
Vue.prototype.$http = instance;
Vue.prototype.$loginHttp = login_instance;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});



