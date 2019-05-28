<template>
  <div class="app-wrap">
    <HeaderTop header-title="Order Detail" goBack="true">
      <!-- <span slot="title_center" class="">Flight</span> -->
    </HeaderTop>
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderTop from '@/components/Header.vue';

export default {
  components: {
    HeaderTop
  }
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
