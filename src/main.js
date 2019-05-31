import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import io from 'socket.io-client'
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);

const socket = io('localhost:3000/bingo');
Vue.prototype.$socket = socket;

new Vue({
  router,

  el: '#app',
  render: h => h(App)
})
