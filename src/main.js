import Vue from 'vue'
import App from './App'
import router from './router'

// 导入element-ui
import ElementUI from 'element-ui'
// 导入element-ui的样式文件
import 'element-ui/lib/theme-chalk/index.css'

// 导入通用的样式
import '@/assets/base.css'

/*
  解决每个都需要引入axios的问题
    把axios绑定到Vue的原型上
*/
import axios from 'axios'
Vue.prototype.axios = axios

// 给axios设置一个全局的默认的baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 配置axios的请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.eject(error)
  }
)

// 使用element-ui插件
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
