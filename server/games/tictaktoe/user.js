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
  delete userMap[user.id];
  console.log(`Disconnected user ${user.id} by ${reason}`);
};

const createUser = (socket) => {
  const user = new GameUser(socket);

  // 유저 목록에 추가
  userMap[user.id] = user;

  console.log(`connected tictaktoe game to ${user.id}`);

  return user;
};

module.exports = { createUser };
