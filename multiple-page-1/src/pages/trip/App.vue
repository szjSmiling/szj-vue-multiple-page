<template>
  <div class="trip_box">
    <!-- <HeaderTop v-if="goBack === 1" header-title="My trip" goBack="true"></HeaderTop> -->
    <!-- <div v-if="goBack !== 1" class="header header-new">
      <div class="header-goback iconfont icon-arrow-left s-icon s-icon-return" @click="backToMyTrip"></div>
      <div class="header-title ellipsis">My trip</div>
    </div> -->
    <router-view></router-view>
    <CancelModel v-show="showCancelModel" :flightOrderIdString="flightOrderIdString" />
    <Foot />
  </div>
</template>
<script>
// import HeaderTop from '@/components/Header.vue';
import EventHub from '@/utils/EventHub';
export default {
  components: {
    // HeaderTop,
    Foot: () => import('@/components/Foot.vue'),
    CancelModel: () => import('./views/CancelModel')
  },
  data () {
    return {
      goBack: 1,
      showCancelModel: false,
      flightOrderIdString: ''
    }
  },
  computed: {
    status () {
      return this.$store.state.MyTripList.status;
    }
  },
  watch: {
    $route (to, from) {
      let route = this.$route.path;
      if (route.indexOf('/trip/detail') > -1) {
        this.goBack = 2;
      } else {
        if (route.indexOf('/trip/') > -1) {
          this.goBack = 1;
        } else {
          this.goBack = 0;
        }
      }
    }
  },
  methods: {
    backToMyTrip () {
      switch (this.goBack) {
        case 0:
          location.href = location.origin;
          break;
        case 2:
          this.$router.push('/trip');
          break;
        default:
          break;
      }
    }
  },
  created () {
    let referrer = document.referrer;
    let route = this.$route.path;
    if (referrer === '') {
      this.goBack = 0;
    } else {
      if (referrer.indexOf('/payment-status?') <= -1) {
        this.goBack = 1;
      } else {
        if (route.indexOf('/trip/detail') > -1) {
          this.goBack = 2;
        } else {
          this.goBack = 0;
        }
      }
    }
    EventHub.$on('showCncelModel', (data) => {
      this.showCancelModel = true;
      this.flightOrderIdString = data;
    });
    EventHub.$on('hideCancelModel', () => {
      this.showCancelModel = false;
    });
    EventHub.$on('hideCancelModelSucc', () => {
      this.showCancelModel = false;
      this.$store.dispatch('selectDiffStatus', 2);
    });
  },
  destroyed () {
    EventHub.$off('showCncelModel');
    EventHub.$off('hideCancelModel');
    EventHub.$off('hideCancelModelSucc');
  }
};
</script>
<style lang="scss">
@import '~@/assets/css/common.scss';
@import '~@/assets/css/sprite.css';
@import '~@/assets/fonts/iconfont.css';
.trip_box{
  height:100%;
  .home-logo{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 5;
  }
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
}
</style>
