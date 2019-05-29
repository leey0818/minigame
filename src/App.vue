<template>
  <div id="app">
    <input type="number" v-model.number="bingoSize" />
    <table class="bingo-wrap">
      <tr v-for="(_, row) in bingoSize" :key="row">
        <td v-for="(_, col) in bingoSize" :key="col"><div class="bingo-item">{{ bingoSize * row + col }}</div></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      bingoSize: 4,
      bingoInputs: [],
    };
  },
  watch: {
    bingoSize () {

    }
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
  border: 1px solid #aaa;
}
table.bingo-wrap tr:not(:last-child) {
  border-bottom: 1px solid #aaa;
}
table.bingo-wrap tr td:not(:last-child) {
  border-right: 1px solid #aaa;
}

.bingo-item {
  width: 100px;
  height: 100px;
  /* background-color: burlywood; */
}
</style>
