import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(Vant).use(axios);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
