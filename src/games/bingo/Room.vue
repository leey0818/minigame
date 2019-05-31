<template>
  <div>
    <div class="position-fixed w-100 h-100 bg-white text-center pt-5" v-if="loading">
      <b-spinner class="align-middle"></b-spinner>
      <span class="ml-1">해당 방에 연결 중 입니다...</span>
    </div>
    <h3>빙고 시작합시다</h3>
    <div>
      <table class="bingo-wrap">
        <tr v-for="(row, rowIdx) in bingoInputs" :key="rowIdx">
          <td v-for="(col, colIdx) in row" :key="colIdx">
            <template v-if="saveBingo">
              <div class="bingo-item" :class="{ checked: col.checked }" :style="itemSize" @click="col.checked = !col.checked">{{ col.key }}</div>
            </template>
            <template v-else>
              <input type="text" class="bingo-item" :style="itemSize" v-model.number="col.key" />
            </template>
          </td>
        </tr>
      </table>
    </div>
    <button @click="saveBingo = !saveBingo">{{ saveBingo ? '준비해제' : '준비' }}</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      maxUser: -1,
      saveBingo: false,

      bingoSize: 0,
      bingoInputs: [],
    };
  },
  computed: {
    itemSize () {
      const size = Math.max(Math.ceil(400 / this.bingoSize), 60) + 'px';

      return {
        width: size,
        height: size,
        lineHeight: size,
      };
    },
  },
  methods: {
    generateCards() {
      let rows = [];
      let cols = [];

      for (let i = 0; i < this.bingoSize; i++) {
        for (let j = 0; j < this.bingoSize; j++) {
          // cols.push(this.bingoSize * i + j);
          cols.push({ key: '', checked: false });
        }
        rows.push(cols);
        cols = [];
      }

      this.bingoInputs = rows;
    },
  },

  created() {
    const roomId = this.$route.params.id;

    this.$socket.off('room:join');
    this.$socket.on('room:join', (data) => {
      if (!data.success) {
        alert('해당 방이 존재하지 않습니다.');
        this.$router.replace('/bingo/list')
        return false;
      }

      this.loading = false;
      this.bingoSize = data.size;
      this.maxUser = data.maxUser || -1;

      // 빙고판 생성
      this.generateCards();
    });

    this.$socket.emit('room:join', roomId);
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

.bingo-item {
  width: 100%;
  height: 100%;
  /* background-color: burlywood; */
  font-size: 14px;
  font-weight: normal;
  font-family: 'Nanum Gothic';
  text-align: center;
  border: none;
  padding: 0;
  box-sizing: border-box;
}
.bingo-item.checked {
  background-color: burlywood;
}
input.bingo-item {
  background-color: #ddfaff;
}
</style>
