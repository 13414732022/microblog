import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/base.css'
// 导入饿了么 ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 富文本编辑器 require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入bigInt 用于script无法处理过大的数值
import JSONbig from 'json-bigint'
// 导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
// axios 响应数据处理 先于响应拦截器执行
axios.defaults.transformResponse = [function (data) {
  try { // 严谨一点，如果 data 不是 json 格式字符串就会报错
    return JSONbig.parse(data) // 如果是 json 格式字符串，那就转换并返回给后续使用
  } catch (err) {
    return data // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
  }
}]
// 设置请求拦截器
axios.interceptors.request.use(config => {
  let obj = null
  try { //
    obj = JSON.parse(window.localStorage.getItem('userInfo'))
  } catch (error) {
    obj = null
  }
  if (obj) {
    config.headers.Authorization = `Bearer ${obj.token}`
  }
  return config
})
// 设置响应拦截器
axios.interceptors.response.use(res => {
  return res.data.data // 返回想要的数据
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI) // element-ui
Vue.use(VueQuillEditor) // 富文本编辑器
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
