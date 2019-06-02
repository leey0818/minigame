const io = require('socket.io')();
const port = 3000;
const options = {};

const roomIds = ['room2'];
const roomInfos = {
  room2: {
    title: '이것은 첫번째 방이다.',
    maxUser: 2,
    size: 5,
    users: [],
  },
};
const socketInfos = {};

const bingoNsp = io.of('/bingo');

bingoNsp.on('connection', (socket) => {
  console.log(`connected to ${socket.id}`);

  socket.on('disconnect', (reason) => {
    delete socketInfos[socket.id];
    console.log(`${socket.id} is disconnected... ${reason}`);
  });

  socket.on('room:join', (roomId, name) => {
    if (roomIds.indexOf(roomId) == -1) {
      socket.emit('room:join', { success: false, reason: 'room is not exists' });
      return;
    }

    console.log(`${socket.id} is joined ${roomId}`);
    socket.join(roomId, () => {
      const roomInfo = roomInfos[roomId];

      if (roomInfo.users.indexOf(socket.id) == -1) {
        roomInfo.users.push(socket.id);
      }

      bingoNsp.to(roomId).emit('room:join', { success: true, id: roomId, ...roomInfo });
    });
  });
  socket.on('room:leave', () => {

  });
  socket.on('list', () => {
    const rooms = [];

    roomIds.forEach((roomId) => {
      const roomInfo = roomInfos[roomId];
      if (!roomInfo) return;

      rooms.push({ id: roomId, title: roomInfo.title, curUser: roomInfo.users.length });
    });

    socket.emit('list', { rooms });
  });
});


// listen port
console.log(`listening port ${port}`);
io.listen(port, options);
