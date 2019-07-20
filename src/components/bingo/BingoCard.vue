<template>
  <div class="item-root">
    <template v-if="readonly">
      <div class="bingo-item" @click="onClickItem">{{ text }}</div>
    </template>
    <template v-else>
      <input type="text" class="bingo-item" ref="inputItem"
        :maxlength="maxlength"
        :value="text"
        @input="onInputItem" />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    readonly: Boolean,
    maxlength: String,
  },
  data () {
    return {
      prevText: '',
    };
  },
  methods: {
    onInputItem () {
      const $ref = this.$refs.inputItem;
      let text = $ref.value;
      text = text.replace(/[^0-9]/g, '');

      $ref.value = text;

      if (text === this.prevText) return;

      this.prevText = text;
      this.$emit('update:text', text);
    },

    onClickItem () {
      this.$emit('click');
    },
  },
}
</script>

<style scoped>
div.item-root {
  position: relative;
}

.bingo-item {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  text-align: center;
  font-size: 14px;
  font-weight: normal;
  font-family: 'Nanum Gothic';
  box-sizing: border-box;
}

div.item-root.checked .bingo-item {
  background-color: burlywood;
}
input.bingo-item {
  background-color: #ddfaff !important;
}
</style>
