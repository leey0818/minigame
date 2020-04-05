<template>
  <b-container>
    <h2>TicTakToe Game!</h2>
    <div class="mb-2">
      <card-table
        :items="items"
        @clickCell="onClickCell"
        :clickable="!gameEnd"
      ></card-table>
      <div class="d-inline-block align-top ml-2">
        <h3>
          <span v-if="gameEnd && winner">{{ winner }} 님의 승리!</span>
          <span v-else-if="gameEnd && !winner">무승부!</span>
          <span v-else>{{ turn }} 님의 턴 입니다.</span>
        </h3>
        <b-button size="sm" variant="primary" @click="resetItems" v-show="gameEnd">게임 다시하기</b-button>
      </div>
    </div>
  </b-container>
</template>

<script>
import CardTable from '../../components/common/CardTable.vue';

export default {
  components: {
    CardTable,
  },
  data() {
    return {
      items: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      checked: [],
      size: 3,
      turn: 'X',
      winner: null,
      gameEnd: false,
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
  },
};
</script>

<style>

</style>
