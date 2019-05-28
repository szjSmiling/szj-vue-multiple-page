<template>
  <div class="booking-warp" :class="{'booking_wrap2': showPDF}">
    <router-view></router-view>
  </div>
</template>
<script>
import EventHub from '@/utils/EventHub';
export default {
  data () {
    return {
      showPDF: false
    }
  },
  components: {
  },
  created () {
    // 刷新页面 回到顶部
    window.addEventListener('beforeunload', this.fn);
    EventHub.$on('controlPDF', res => {
      this.showPDF = res;
    });
  },
  methods: {
    fn () {
      // window.scrollTo(0, 0);
    },
  }

};
</script>

<style lang="scss">
@import '~@/assets/css/common.scss';
@import '~@/assets/css/sprite.css';
.booking-warp{
  // height: 100%;
  overflow: auto;
}
.booking_wrap2{
  // height:100%;
}
  .gray{
    color: $gray;
  }
  .a_link{
    color: $green;
    text-decoration: underline;
  }
</style>
