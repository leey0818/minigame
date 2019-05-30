<template>
  <div>
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
    <button @click="saveBingo = true" v-if="!saveBingo">준비</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
  watch: {
    bingoSize () {
      this.generateCards();
    },
    '$route.params'() {
      this.changeBingoSize(this.$route.params.size);
    },
  },
  methods: {
    generateCards() {
      let rows = [];
      let cols = [];

      for (let i = 0; i < this.bingoSize; i++) {
        for (let j = 0; j < this.bingoSize; j++) {
          // cols.push(this.bingoSize * i + j);
          cols.push({ key: null, checked: false });
        }
        rows.push(cols);
        cols = [];
      }

      this.bingoInputs = rows;
    },
    changeBingoSize (size) {
      const bingoSize = parseInt(size, 10);

      if (isNaN(bingoSize)) {
        this.$router.replace('/bingo');
        return;
      }

      this.bingoSize = bingoSize;
    },
  },

  created() {
    this.changeBingoSize(this.$route.params.size);
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
