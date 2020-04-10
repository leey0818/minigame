import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/bootstrap'
// import './plugins/socket'

new Vue({
  router,

  el: '#app',
  render: h => h(App)
});
