const { GameUser } = require('./index');

const userMap = {};
const waitRooms = [];
const roomMap = {};
let nextRoomNumber = 1;

class TicTakToeUser extends GameUser {
  // set event listener
  setEventListeners() {
    this.socket.on('disconnect', onDisconnect(this));
  }
}

const onDisconnect = (user) => (reason) => {
  delete userMap(user.id);
  console.log(`${user.id} is disconnected... ${reason}`);
};

const onConnect = (socket) => {
  const user = new TicTakToeUser(socket);

  userMap[user.id] = user;
  console.log(`connected ttt game to ${user.id} ${Object.keys(userMap).length}`);
};

module.exports = onConnect;
