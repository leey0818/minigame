<template>
  <b-container fluid class="pt-2">
    <div class="position-fixed w-100 h-100 bg-white text-center pt-5" v-if="loading">
      <b-spinner class="align-middle"></b-spinner>
      <span class="ml-1">해당 방에 연결 중 입니다...</span>
    </div>
    <h3>빙고 시작합시다</h3>
    <div>
      <table class="bingo-wrap">
        <tr v-for="(_, row) in bingoSize" :key="row">
          <td v-for="(_, col) in bingoSize" :key="col">
            <bingo-card
              maxlength="4"
              :text.sync="inputs[getCardIndex(row, col)]"
              :readonly="ready"
              :class="getCardStatus(row, col)"
              :style="itemStyle"
              @click="clickCard(row, col)"></bingo-card>
          </td>
        </tr>
      </table>
    </div>
    <button @click="ready = !ready">{{ ready ? '준비해제' : '준비' }}</button>
  </b-container>
</template>

<script>
import BingoCard from '@/components/bingo/BingoCard';

export default {
  components: {
    BingoCard,
  },
  props: ['roomId'],
  data () {
    return {
      loading: true,
      maxUser: -1,
      bingoSize: 0,

      ready: false,
      inputs: [],
      checks: [],
    };
  },
  computed: {
    itemStyle () {
      const size = Math.max(Math.ceil(400 / this.bingoSize), 60) + 'px';

      return {
        width: size,
        height: size,
        lineHeight: size,
      };
    },
  },
  sockets: {
    'room:join' (data) {
      if (!data.success) {
        alert('해당 방이 존재하지 않습니다.');
        this.$router.replace('/bingo/list');
        return false;
      }

      this.loading = false;
      this.bingoSize = data.size;
      this.maxUser = data.maxUser || -1;

      this.generateCards();
    },
  },
  methods: {
    generateCards () {
      this.inputs = new Array(this.bingoSize * this.bingoSize).fill('');
      this.checks = new Array(this.bingoSize * this.bingoSize).fill(false);
    },
    getCardIndex (row, col) {
      return (this.bingoSize * row) + col;
    },
    getCardStatus (row, col) {
      return { checked: this.checks[this.getCardIndex(row, col)] };
    },

    clickCard (row, col) {
      const index = this.getCardIndex(row, col);
      this.$set(this.checks, index, !this.checks[index]);
    },
  },

  created () {
    this.$socket.emit('room:join', this.roomId);
  },
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}
table, tr, td {
  margin: 0;
  padding: 0;
}

table.bingo-wrap {
  border: 1px solid #888;
}
table.bingo-wrap tr:not(:last-child) {
  border-bottom: 1px solid #888;
}
table.bingo-wrap tr td:not(:last-child) {
  border-right: 1px solid #888;
}
</style>
