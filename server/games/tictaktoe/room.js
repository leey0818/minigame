const roomMap = {};

let nextRoomNumber = 1;

const getNextRoomId = () => {
  return `room_${nextRoomNumber++}`;
};

const createRoom = (user) => {
  if (user.roomId) {
    return Promise.reject({ reason: 'Already joined room', room: user.roomId });
  }

  const room = {
    id: getNextRoomId(),
    title: '방 이다!',
    board: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    start: false, // 게임시작 여부
    users: [],    // 방인원 (최대 2명)
    owner: null,  // 방장
    turn: null,   // 차례
  };

  // 방 생성
  return new Promise((resolve) => {
    user.socket.join(room.id, () => {
      console.log(`created room ${room.id} by user ${user.id}`);

      // 방 목록에 추가
      roomMap[room.id] = room;
      room.users.push(user);
      room.owner = user;

      // 유저 객체에 방 ID 추가
      user.roomId = room.id;

      // 응답
      resolve({ room: { id: room.id, title: room.title } });
    });
  });
};

const joinRoom = (user, roomId) => {
  if (!findWaitRoomIds().includes(roomId)) {
    return Promise.reject({ reason: 'Not waiting room' });
  }
  if (!roomMap[roomId]) {
    return Promise.reject({ reason: 'Not exist room' });
  }

  const room = roomMap[roomId];

  // 방 입장
  return new Promise((resolve) => {
    user.socket.join(room.id, () => {
      console.log(`joined room ${room.id} to user ${user.id}`);

      // 방에 사용자 정보 추가
      room.users.push(user);
      user.roomId = room.id;

      // broadcast
      user.nsp.to(room.id).emit('room:join', { opponent: { nickname: user.nickname } });

      // 응답
      resolve({
        room: { id: room.id, title: room.title },
        owner: { name: room.owner.nickname }
      });
    });
  });
};

const findWaitRooms = () => {
  return Object.values(roomMap).filter((room) => room.users.length < 2);
};

const findWaitRoomIds = () => {
  return findWaitRooms().map((room) => room.id);
};

module.exports = { createRoom, joinRoom, findWaitRooms, findWaitRoomIds };
