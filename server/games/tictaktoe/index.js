const {
  createUser,
  leaveUser,
} = require('./user');
const {
  createRoom,
  joinRoom,
  readyRoom,
  getWaitRooms,
} = require('./room');

const setEventListeners = (user) => {
  user.socket.on('disconnect', (reason) => leaveUser(user, reason));
  user.socket.on('room:ready', (ready) => readyRoom(user, ready));
};

const onConnect = (socket) => {
  const user = createUser(socket);

  // 소켓 이벤트 바인딩
  setEventListeners(user);

  // 대기 중인 방목록
  const waitRooms = getWaitRooms();

  if (waitRooms.length) {
    // 대기 중인 방에 접속
    const roomId = waitRooms[0].id;

    // 방 접속
    joinRoom(user, roomId)
      .then((data) => user.socket.emit('room:join', { error: false, data }))
      .catch((data) => user.socket.emit('room:join', { error: true, data }));
  } else {
    // 방 생성
    createRoom(user)
      .then((data) => user.socket.emit('room:create', { error: false, data }))
      .catch((data) => user.socket.emit('room:create', { error: true, data }));
  }
};

module.exports = onConnect;
