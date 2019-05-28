<template>
  <div class="flight_app">
    <!-- <keep-alive> -->
     <router-view></router-view>
    <!-- </keep-alive> -->
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
  </div>
</template>
<script>

export default {
  components: {
  },
  created () {
    if (sessionStorage.getItem('home_store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('home_store'))))
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('home_store', JSON.stringify(this.$store.state))
    })
  }
};
</script>
<style lang="scss">
@import '~@/assets/css/common.scss';
@import '~@/assets/css/sprite.css';
@import '~@/assets/fonts/iconfont.css';
.flight_app{
  height:100%;
  .header{
    position: absolute !important;
  }
}
</style>
