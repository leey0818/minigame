const { createUser } = require('./user');
const {
  createRoom,
  joinRoom,
  getWaitRoomIds,
} = require('./room');

const onConnect = (socket) => {
  const user = createUser(socket);

  // 대기 중인 방목록
  const waitRoomIds = getWaitRoomIds();

  if (waitRoomIds.length) {
    // 대기 중인 방에 접속
    const roomId = waitRoomIds[0];

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
