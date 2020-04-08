const { BaseGameUser } = require('../base');

const userMap = {};

class GameUser extends BaseGameUser {
  constructor(socket) {
    super(socket);
    this.nickname = 'Anonymous';
  }

  // set event listener
  setEventListeners() {
    this.socket.on('disconnect', onDisconnect(this));
  }

  get roomId() {
    return this.room && this.room.id;
  }
}

const onDisconnect = (user) => (reason) => {
  if (user.room) {
    user.room.leaveUser(user);
  }

  delete userMap[user.id];
  console.log(`Disconnected user ${user.id} by ${reason}`);
};

/**
 * 사용자 객체 생성
 * @param {Object} socket io socket
 */
const createUser = (socket) => {
  const user = new GameUser(socket);

  // 유저 목록에 추가
  userMap[user.id] = user;

  console.log(`connected tictaktoe game to ${user.id}`);

  return user;
};

module.exports = { createUser };
