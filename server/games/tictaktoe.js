const { GameUser } = require('./index');

const userMap = {};
const roomMap = {};
const waitRooms = new Set();
let nextRoomNumber = 1;

const defaultRoomInfo = {
  board: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  owner: null,    // -1
  opponent: null, // 1
  turn: -1,
}

class TicTakToeUser extends GameUser {
  // set event listener
  setEventListeners() {
    this.socket.on('disconnect', onDisconnect(this));
    this.socket.on('room:create', onCreateRoom(this));
    this.socket.on('room:join', onJoinRoom(this));
  }

  get name() {
    return this.name || 'Anonymous';
  }

  set name(name) {
    this.name = name;
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

const getNextRoomId = () => {
  return `room_${nextRoomNumber++}`;
};

const onDisconnect = (user) => (reason) => {
  delete userMap[user.id];
  console.log(`${user.id} is disconnected... ${reason}`);
};

const onCreateRoom = (user) => (roomName, fn) => {
  if (user.roomId) {
    return fn({ error: true, reason: 'Already joined room', room: user.roomId });
  }

  const room = {
    id: getNextRoomId(),
    title: roomName,
    ...defaultRoomInfo,
  };

  // 방 생성
  setTimeout(() => {
    user.socket.join(room.id, () => {
      console.log(`created room ${room.id} by user ${user.id}`);

      // 방 목록 및 대기방 목록에 추가
      waitRooms.add(room.id);
      roomMap[room.id] = room;
      room.owner = user;

      // 유저 객체에 방 ID 추가
      user.roomId = room.id;

      // 응답
      fn({ error: false, room: { id: room.id, title: room.title } });
    });
  }, 2000);
};

const onJoinRoom = (user) => (roomId, fn) => {
  if (!waitRooms.has(roomId)) {
    return fn({ error: true, reason: 'Not waiting room' });
  }
  if (!roomMap[roomId]) {
    return fn({ error: true, reason: 'Not exist room' });
  }

  const room = roomMap[roomId];

  // 대기 방에서 삭제
  waitRooms.delete(roomId);

  // 방 입장
  user.socket.join(room.id, () => {
    console.log(`joined room ${room.id} to user ${user.id}`);

    // 방에 사용자 정보 추가
    room.opponent = user;
    user.roomId = room.id;

    // broadcast
    user.nsp.to(room.id).emit('room:join', { opponent: { name: user.name } });

    // 응답
    fn({
      room: { id: room.id, title: room.title },
      owner: { name: room.owner.name }
    });
  });
};

const onConnect = (socket) => {
  const user = new TicTakToeUser(socket);

  userMap[user.id] = user;
  console.log(`connected ttt game to ${user.id} ${Object.keys(userMap).length}`);
};

module.exports = onConnect;
