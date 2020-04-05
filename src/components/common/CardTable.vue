<template>
  <div class="d-inline-block">
    <table>
      <tr v-for="(_, rowIdx) in size" :key="`row_${rowIdx}`">
        <td v-for="(_, colIdx) in size"
          :key="`col_${colIdx}`"
          :class="clickable && 'clickable'"
          @click="() => onClickCell(rowIdx, colIdx)"
        >
          <div>
            <slot name="cell" :pos="{ row: rowIdx, col: colIdx }">
              {{ items[rowIdx] && items[rowIdx][colIdx] }}
            </slot>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    size: {
      type: Number,
      default: 3,
    },
    clickable: Boolean,
  },
  methods: {
    onClickCell(row, col) {
      if (this.clickable) {
        this.$emit('clickCell', { row, col });
      }
    }
  },
};
</script>

<style scoped>
table {
  border: 1px solid;
  border-color: #ddd;
}
tr:not(:first-child) {
  border-top: 1px solid;
  border-color: inherit;
}
td:not(:first-child) {
  border-left: 1px solid;
  border-color: inherit;
}
td {
  width: 100px;
  height: 100px;
  vertical-align: middle;
  box-sizing: border-box;
}
td > div {
  word-break: break-all;
  text-align: center;
  line-height: 1;
  font-size: 2.8rem;
  font-weight: 300;
}
.clickable {
  cursor: pointer;
}
</style>
