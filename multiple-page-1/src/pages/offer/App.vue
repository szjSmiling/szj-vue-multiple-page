<template>
  <div class="app-wrap">
    <router-view></router-view>
  </div>
</template>
<script>
export default {

};
</script>

<style lang="scss">
@import '~@/assets/css/common.scss';
@import '~@/assets/css/sprite.css';
@import '~@/assets/fonts/iconfont.css';

  .gray{
    color: $gray;
  }
  .app-wrap{
    width: 100%;
    height: 100%;
  }
</style>
