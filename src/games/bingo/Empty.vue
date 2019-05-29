<template>
  <div>
    <span>빙고 칸을 입력해보시오</span>
    <input type="number" v-model.number="bingoSize" />
    <button @click="gotoBingo">생성</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bingoSize: 4,
    }
  },
  methods: {
    gotoBingo() {
      this.$router.push('/bingo/' + this.bingoSize);
    },
  }
}
</script>
