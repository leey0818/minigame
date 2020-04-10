import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'

const VueSocket = new VueSocketIO({
  debug: true,
  connection: io('localhost:3000/tictaktoe'),
});

Vue.use(VueSocket);
