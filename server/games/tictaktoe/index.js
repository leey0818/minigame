const { GameUser } = require('../index');
const {
  createRoom,
  joinRoom,
  findWaitRoomIds,
} = require('./room');

const userMap = {};

class TicTakToeUser extends GameUser {
  constructor(socket) {
    super(socket);
    this.nickname = 'Anonymous';
  }

  // set event listener
  setEventListeners() {
    this.socket.on('disconnect', onDisconnect(this));
    // this.socket.on('room:create', onCreateRoom(this));
    // this.socket.on('room:join', onJoinRoom(this));
  }

  get roomId() {
    return this.room;
  }

  set roomId(id) {
    this.room = id;
  }

  get player() {
    return this.opponent;
  }

  set player(id) {
    this.opponent = id;
  }
}

const onDisconnect = (user) => (reason) => {
  delete userMap[user.id];
  console.log(`${user.id} is disconnected... ${reason}`);
};

const onConnect = (socket) => {
  const user = new TicTakToeUser(socket);

  // 유저 목록에 추가
  userMap[user.id] = user;

  console.log(`connected ttt game to ${user.id} ${Object.keys(userMap).length}`);

  const waitRoomIds = findWaitRoomIds();

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
