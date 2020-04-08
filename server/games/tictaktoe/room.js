const roomMap = {};

class GameRoom {
  constructor(owner) {
    this.id = `room_${getRandomId()}`;
    this.title = '방 제목';
    this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.users = [owner]; // 방인원 (최대 2명)
    this.owner = owner;   // 방장
    this.start = false;   // 게임시작 여부
    this.turn  = 0;  // 차례
  }

  leaveUser(user) {
    const idx = this.users.indexOf(user);
    // 방 유저에서 삭제
    if (idx >= 0) {
      this.users.splice(idx, 1);
    }

    // 방이 빈 경우 방 삭제
    if (this.users.length === 0) {
      console.log(`Destroyed room. ${this.id}`);
      delete roomMap[this.id];
    }
    // 내가 방장이면 다른사람에게 방장권한 부여
    else if (this.owner === user) {
      this.owner = this.users[0];
    }
  }
}

const getRandomId = () => {
  const id = Math.random().toString(16).replace(/[^a-z0-9]+/g, '').substr(1, 5);

  if (roomMap[id]) {
    return getRandomId();
  }
  return id;
};

const createRoom = (user) => {
  if (user.room) {
    return Promise.reject({
      reason: 'Already joined room',
      room: {
        id: user.room.id,
        title: user.room.title
      }
    });
  }

  // 방 생성
  return new Promise((resolve) => {
    const room = new GameRoom(user);

    user.socket.join(room.id, () => {
      console.log(`created room ${room.id} by user ${user.id}`);

      // 방 목록에 추가
      roomMap[room.id] = room;
      console.log(`created room size: ${Object.keys(roomMap).length}`);

      // 유저 객체에 방 객체 추가
      user.room = room;

      // 응답
      resolve({ room: { id: room.id, title: room.title } });
    });
  });
};

/**
 * 방 입장
 * @param {GameUser} user 사용자 객체
 * @param {string} roomId 입장할 방 ID
 */
const joinRoom = (user, roomId) => {
  if (!getWaitRoomIds().includes(roomId)) {
    return Promise.reject({ reason: 'Not waiting room' });
  }
  if (!roomMap[roomId]) {
    return Promise.reject({ reason: 'Not exist room' });
  }

  const room = roomMap[roomId];

  // 방 입장
  return new Promise((resolve) => {
    user.socket.join(room.id, () => {
      // 방에 사용자 정보 추가
      room.users.push(user);
      user.room = room;

      console.log(`joined room ${room.id}[${room.users.length}] to user ${user.id}`);

      // broadcast
      user.socket.to(room.id).emit('room:join', { opponent: { nickname: user.nickname } });

      // 응답
      resolve({
        room: { id: room.id, title: room.title },
        users: room.users.map((user) => ({ nickname: user.nickname })),
      });
    });
  });
};

const getWaitRooms = () => {
  return Object.values(roomMap).filter((room) => room.users.length < 2);
};

const getWaitRoomIds = () => {
  return getWaitRooms().map((room) => room.id);
};

module.exports = { createRoom, joinRoom, getWaitRooms, getWaitRoomIds };
