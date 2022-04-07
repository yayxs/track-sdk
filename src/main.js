import Vue from 'vue'
import dayjs from 'dayjs'
import App from './App.vue'
import router from './router'
import TrackSdk from './track'

new TrackSdk({})

Vue.config.productionTip = false
Vue.prototype.$d = dayjs
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
