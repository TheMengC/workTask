import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'
Vue.use(Vant)
Vue.prototype.$ajax = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
