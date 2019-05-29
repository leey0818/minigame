const io = require('socket.io')();
const port = 3000;

io.on('connection', (socket) => {
  console.log(`connected to ${socket.id}`);
});


// listen port
console.log(`listening port ${port}`);
io.listen(port);


const cio = require('socket.io-client');
const socket = cio('http://localhost:3000/socket.io');