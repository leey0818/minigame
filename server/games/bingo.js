const { GameUser } = require('./index');

const userMap = {};
const roomMap = {
  room2: {
    title: '이것은 첫번째 방일까?',
    maxUser: 2,
    size: 5,
    users: [],
  },
};

class BingoUser extends GameUser {
  // set event listener
  setEventListeners() {
    this.socket.on('disconnect', onDisconnect(this));
    this.socket.on('room:join', onJoinRoom(this));
    this.socket.on('room:leave', onLeaveRoom(this));
    this.socket.on('list', onListRoom(this));
  }
}

const onDisconnect = (user) => (reason) => {
  delete userMap[user.id];
  console.log(`${user.id} is disconnected... ${reason}`);
};

const onJoinRoom = (user) => (roomId, name) => {
  if (roomMap[roomId] === undefined) {
    return user.socket.emit('room:join', {
      success: false,
      reason: 'room is not exist',
    });
  }

  console.log(`${user.id} is joined ${roomId}`);
  user.socket.join(roomId, () => {
    const room = roomMap[roomId];

    if (room.users.indexOf(user.id) == -1) {
      room.users.push(user.id);
    }

    user.nsp.to(roomId).emit('room:join', {
      success: true,
      id: roomId,
      ...room,
    });
  });
};

const onLeaveRoom = (user) => () => {
  // TODO
};

const onListRoom = (user) => () => {
  const rooms = [];

  Object.keys(roomMap).forEach((roomId) => {
    const room = roomMap[roomId];
    rooms.push({ id: roomId, title: room.title, curUser: room.users.length });
  });

  user.socket.emit('list', { rooms });
};

const onConnect = (socket) => {
  const user = new BingoUser(socket);

  userMap[user.id] = user;
  console.log(`connected to ${user.id} ${Object.keys(userMap).length}`);
};


module.exports = onConnect;
