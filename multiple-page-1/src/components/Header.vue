<template>
  <div class="header">
    <div v-if="goBack" class="header-goback iconfont icon-arrow-left s-icon s-icon-return" @click="navigate"></div>
    <div class="header-title ellipsis" v-if="headerTitle">
      {{headerTitle}}
    </div>
    <slot name="title_right"></slot>
  </div>
</template>
<script>
export default {
  props: ['goBack', 'headerTitle'],
  methods: {
    navigate () {
      if (typeof this.goBack === 'function') {
        this.goBack();
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header{
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height:$headerH;
  width: 100%;
  padding: 0 15px;
  background-color: #fff;
  z-index: 1000;
}
.header-title{
  width: 50%;
  color: $black;
  font-size: 18px;
  margin-left: 15px;
}
</style>
