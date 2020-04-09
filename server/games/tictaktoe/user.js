const { BaseGameUser } = require('../base');

const userMap = {};

class GameUser extends BaseGameUser {
  constructor(socket) {
    super(socket);
    this.nickname = 'Anonymous';
    this.room = null; // 방 정보
  }

  // 방 입장
  joinRoom(room) {
    this.room = room;
    this.room.join(this);
  }

  // 방 퇴장
  leaveRoom() {
    if (this.room) {
      this.room.leave(this);
      this.room = null;
    }
  }
}

/**
 * 사용자 연결종료
 * @param {GameUser} user 사용자 객체
 * @param {string} reason disconnect reason
 */
const leaveUser = (user, reason) => {
  // 유저 방 퇴장
  user.leaveRoom();

  // 유저 목록에서 삭제
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

module.exports = { createUser, leaveUser };
