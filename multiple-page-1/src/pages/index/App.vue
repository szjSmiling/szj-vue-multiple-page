<template>
  <div class="app-wrap">
    <!-- <HeaderTop header-title="Flight" goBack="true">

    </HeaderTop> -->
    <router-view></router-view>
    <Footer />
  </div>
</template>
<script>
// import HeaderTop from '@/components/Header.vue';
import Footer from '@/components/Foot.vue';
export default {
  components: {
    Footer,
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
  .home-logo{
    position: sticky;
    bottom: 0;
    left: 0;
  }
</style>
