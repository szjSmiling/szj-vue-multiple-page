<template>
  <div class="top_banner">
    <!-- <mt-swipe :auto="3000">
      <mt-swipe-item v-for="(item, index) in topBanners" :key="index" >
        <a :href="item.href" style="height:100%;width:100%;cursor:pointer;">
          <img class="banner-img" :src="item.landingPageUrl">
        </a>
      </mt-swipe-item>
    </mt-swipe> -->
    <!-- <img class="banner-img" :src="(this.topBanners[0]|| {}).landingPageUrl" alt=""> -->
    <div class="top_banner__title">
      Lowest Price Gauranteed
    </div>
    <div class="top_banner__text">
      Only on My Galaxy
    </div>
  </div>
</template>
<script>
// import { Swipe, SwipeItem } from 'mint-ui';
// import { hasItem, getItem } from '@/utils/CookieUtils';
// import { getAdvertising } from '@/constants/ApiConstants';

export default {
  // components: {
  //   'mt-swipe': Swipe,
  //   'mt-swipe-item': SwipeItem
  // },
  data () {
    return {
      topBanners: []
    };
  },
  methods: {
    // getHomeTopBanner () {
    //   const url = getAdvertising + '?type=33&device=0&platform=' + hasItem('platform') ? getItem('platform') : '065626cf-a5a9-4ae8-ba71-ed5f4b8b748d';;
    //   this.$http(url, {
    //     headers: {
    //       'x-Device': 'mobile'
    //     }
    //   }).then(res => {
    //     if (res.success && res.list instanceof Array && res.list.length >= 1) {
    //       this.topBanners = res.list;
    //     }
    //   }).catch(e => {
    //     console.log(e);
    //   });
    // }
  },
  created () {
    // this.getHomeTopBanner();
  }
};
</script>
<style lang="scss" scoped>
  .top_banner{
    height: 2.4rem;
    background:linear-gradient(180deg,rgba(67,22,105,1) 0%,rgba(31,7,66,1) 100%);
    padding-top: 0.44rem;
    text-align: center;
  }
  .top_banner__title{
    font-weight:bold;
    font-size: 0.46rem;
    color: #fff;
  }
  .top_banner__text{
    font-size: $h5;
    color: #fafafa;
  }
  // .banner-img{
  //   width: 100%;
  //   height: 100%;
  // }
</style>
