<template>
  <b-container>
    <h2 class="my-2">
      <span>{{ title }}</span>
      <b-btn
        class="float-right"
        size="sm"
        variant="outline-secondary"
        v-if="isRoomOwner"
      >방 설정 변경</b-btn>
    </h2>
    <div class="mt-5 mb-2">
      <div class="d-flex">
        <div class="flex-grow-0 flex-shrink-0">
          <card-table
            :items="items"
            @clickCell="onClickCell"
            :clickable="!gameEnd"
          ></card-table>
        </div>
        <div class="mx-2"></div>
        <div class="flex-grow-1 flex-shrink-1">
          <ul class="border list-unstyled overflow-auto mb-2 chatbox" ref="chatbox">
            <li v-for="(message, index) in messages" :key="index">
              <span v-if="message.notice">SYSTEM: {{ message.text }}</span>
              <span v-else-if="message.self">&gt;&gt; 나: {{ message.text }}</span>
              <span v-else>&lt;&lt; 상대: {{ message.text }}</span>
            </li>
          </ul>
          <b-form-input size="sm" v-model="chatText" @keypress.exact.enter="sendChatMessage"></b-form-input>
          <h3>
            <span v-if="gameEnd && winner">{{ winner }} 님의 승리!</span>
            <span v-else-if="gameEnd && !winner">무승부!</span>
            <span v-else>{{ turn }} 님의 턴 입니다.</span>
          </h3>
          <b-btn size="sm" variant="primary" @click="resetItems" v-show="gameEnd">게임 다시하기</b-btn>
        </div>
      </div>
      <!-- <div class="d-inline-block align-top ml-2">
      </div> -->
    </div>
    <b-overlay blur="5px" :opacity="0.9" :show="!connected" no-fade no-wrap></b-overlay>
  </b-container>
</template>

<script>
import io from 'socket.io-client';
import CardTable from '../../components/common/CardTable.vue';

let socket;

export default {
  components: {
    CardTable,
  },
  data() {
    return {
      connected: false,
      title: '',
      items: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      checked: [],
      size: 3,
      turn: 'X',
      isRoomOwner: false,
      winner: null,
      gameEnd: false,

      // 채팅 데이터
      messages: [],
      chatText: '',
    };
  },
  methods: {
    onClickCell({ row, col }) {
      if (this.items[row][col]) return;

      this.$set(this.items[row], col, this.turn);
      this.turn = this.turn === 'X' ? 'O' : 'X';

      let winner;

      // 직선 계산
      for (let i = 0; i < this.size; i++) {
        // 직선 가로
        if (this.items[i][0] && (this.items[i][0] === this.items[i][1]) && (this.items[i][1] === this.items[i][2])) {
          winner = this.items[i][0];
          break;
        }
        // 직선 세로
        if (this.items[0][i] && (this.items[0][i] === this.items[1][i]) && (this.items[1][i] === this.items[2][i])) {
          winner = this.items[0][i];
          break;
        }
      }

      // 대각선 (row와 col이 같을때)
      if (this.items[0][0] && (this.items[0][0] === this.items[1][1]) && (this.items[1][1] === this.items[2][2])) {
        winner = this.items[0][0];
      }
      // 대각선 (row와 col이 반대일때)
      else if (this.items[2][0] && (this.items[2][0] === this.items[1][1]) && (this.items[1][1] === this.items[0][2])) {
        winner = this.items[2][0];
      }

      // 승자가 있는감?
      if (winner) {
        this.winner = winner;
        this.gameEnd = true;
      } else {
        const hasEmptyCell = this.items.some(r => r.some(c => !c));
        if (hasEmptyCell) {
          // 게임 진행 중
        } else {
          this.winner = null;
          this.gameEnd = true;
        }
      }
    },
    resetItems() {
      this.items = Array(this.size).fill().map(() => Array(this.size).fill(''));
      this.turn = 'X';
      this.winner = null;
      this.gameEnd = false;
    },
    sendChatMessage() {
      if (this.chatText && this.chatText.trim()) {
        console.log(`send message! ${this.chatText}`);
        socket.emit('room:chat', this.chatText.trim());
        this.chatText = '';
      }
    }
  },
  created() {
    socket = io('localhost:3000/tictaktoe', {
      transports: ['websocket'],
    });

    socket.on('room:create', ({ error, data }) => {
      this.isRoomOwner = true;
      this.connected = true;
      this.title = data.room.title;
    });
    socket.on('room:join', ({ error, data }) => {
      this.isRoomOwner = false;
      this.connected = true;
      this.title = data.room.title;
    });

    socket.on('room:chat', ({ system, user, text }) => {
      const message = { text };

      if (system) {
        message.notice = true;
      } else {
        message.user = user;
        message.self = (user === socket.id);
      }

      this.messages.push(message);
      this.$nextTick(() => {
        this.$refs.chatbox.scrollTop = 99999;
      });
    });

    socket.on('reconnect', () => { this.connected = true; });
    socket.on('disconnect', () => { this.connected = false; });
  },
  beforeDestroy() {
    if (socket) socket.close();
  }
};
</script>

<style scoped>
.chatbox {
  height: 263px;
}
.chatbox > li {
  padding: 0 3px;
  font-size: 0.85rem;
}
</style>
