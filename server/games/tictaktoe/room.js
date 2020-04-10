const roomMap = {};

class GameRoom {
  constructor() {
    this.id = `room_${getRandomId()}`;
    this.title = '방 제목';
    this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.ready = new Set();    // 준비인원
    this.users = [];    // 방인원 (최대 2명)
    this.owner = null;  // 방장
    this.start = false; // 게임시작 여부
    this.turn  = 0;     // 차례
  }

  // 유저 입장
  join(user) {
    this.users.push(user);

    // 첫 유저면 방장
    if (this.users.length === 1) {
      this.owner = user;
    }
  }

  // 유저 퇴장
  leave(user) {
    const idx = this.users.indexOf(user);
    // 방 유저에서 삭제
    if (idx >= 0) {
      this.users.splice(idx, 1);
    }

    // 방이 빈 경우 방 삭제
    if (this.users.length === 0) {
      console.log(`Destroyed room. ${this.id}`);
      delete roomMap[this.id];
      return;
    }

    // 내가 방장이면 다른사람에게 방장권한 부여
    if (this.owner === user) {
      this.owner = this.users[0];
    }

    // 다른 사람에게 알림
    user.socket.to(this.id).emit('room:chat', { system: true, text: `${user.nickname} 님이 퇴장하였습니다.` });
  }

  // 유저 준비
  ready(user, isReady) {
    if (!this.users.includes(user)) return;

    if (isReady) {
      this.ready.add(user);
    } else {
      this.ready.delete(user);
    }

    // 다른 유저에게 준비상태 알림
    user.socket.to(this.id).emit('room:ready', { user: user.id, ready: isReady });
  }
}

const getRandomId = () => {
  const id = Math.random().toString(16).replace(/[^a-z0-9]+/g, '').substr(1, 5);

  if (roomMap[id]) {
    return getRandomId();
  }
  return id;
};

/**
 * 방 생성
 * @param {GameUser} user 유저 객체
 */
const createRoom = (user) => {
  // 이미 입장한 방이 있으면 퇴장 후 방 생성
  user.leaveRoom();

  // 방 생성
  return new Promise((resolve) => {
    const room = new GameRoom();

    user.socket.join(room.id, () => {
      console.log(`created room ${room.id} by user ${user.id}`);

      // 방 목록에 추가
      roomMap[room.id] = room;
      console.log(`created room size: ${Object.keys(roomMap).length}`);

      // 유저 객체에 방 객체 추가
      user.joinRoom(room);

      // 응답
      resolve({ room: { id: room.id, title: room.title } });
    });
  });
};

/**
 * 방 입장
 * @param {GameUser} user 유저 객체
 * @param {string} roomId 입장할 방 ID
 */
const joinRoom = (user, roomId) => {
  if (!getWaitRooms().some((room) => room.id === roomId)) {
    return Promise.reject({ reason: 'Not waiting room' });
  }
  if (!roomMap[roomId]) {
    return Promise.reject({ reason: 'Not exist room' });
  }

  const room = roomMap[roomId];

  // 방 입장
  return new Promise((resolve) => {
    user.socket.join(room.id, () => {
      // 사용자 정보에 방 추가
      user.joinRoom(room);

      console.log(`joined room ${room.id}[${room.users.length}] to user ${user.id}`);

      // broadcast
      user.socket.to(room.id).emit('room:enter', { opponent: { nickname: user.nickname } });
      user.socket.to(room.id).emit('room:chat', { system: true, text: `${user.nickname} 님이 입장하였습니다.` });
      user.socket.emit('room:chat', { system: true, text: `${room.id} 방에 입장하였습니다. 현재 인원: ${room.users.length}명` });

      // 응답
      resolve({
        room: { id: room.id, title: room.title },
        users: room.users.map((user) => ({ nickname: user.nickname })),
      });
    });
  });
};

/**
 * 유저 방 준비상태 변경
 * @param {GameUser} user 유저 객체
 * @param {boolean} isReady 준비 상태
 */
const readyRoom = (user, isReady) => {
  if (user.room) {
    user.room.ready(user, isReady);
  }
};

const chatRoom = (user, text) => {
  if (user.room) {
    user.nsp.to(user.room.id).emit('room:chat', { user: user.id, text });
  }
};

/**
 * 대기 중인 방목록 조회
 */
const getWaitRooms = () => {
  return Object.values(roomMap).filter((room) => room.users.length < 2);
};

module.exports = { createRoom, joinRoom, readyRoom, chatRoom, getWaitRooms };
