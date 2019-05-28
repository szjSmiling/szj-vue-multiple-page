<template>
  <div class="offer_items" @click="link(offerInfo.href)">
    <div class="item_top">
      <img class="item_top_img" :src="offerInfo.couponCode?offerInfo.imgMsite:offerInfo.url" alt="">
    </div>
    <div class="item_des">
      <div class="item_des-save">
        <p class="des_save_up">{{offerInfo.title}}</p>
        <p class="des_valid_to">valid till: {{offerInfo.endDate | transformTime}}</p>
      </div>
      <p class="des_up_to ellipsis">{{offerInfo.alt}}</p>
    </div>
  </div>
</template>
<script>
import { getMonthDayYearString } from '@/utils/DateFormatUtils';
export default {
  props: ['offerInfo'],
  data () {
    return {
      getMonthDayYearString
    }
  },
  filters: {
    transformTime (val) {
      if (val.indexOf('-')) {
        val = val.replace(/-/g, '/');
      }
      return getMonthDayYearString(new Date(val));
    }
  },
  methods: {
    link (href) {
      if (this.offerInfo.couponCode) {
        window.location.href = location.origin + '/coupon?code=' + this.offerInfo.couponCode;
      } else {
        window.location.href = href;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.offer_items{
  width:6.58rem;
  margin:0 auto 0.3rem;
  background:rgba(255,255,255,1);
  box-shadow:0rem 0.02rem 0.06rem 0rem rgba(174,174,174,0.5);
  border-radius:0.12rem;
  border:0.01rem solid rgba(220,220,220,1);
  &:active{
    filter: saturate(50%);
  }
}
.offer_items:last-child{
  margin-bottom: 0;
}
.item_top{
  height:2.4rem;
  border-top-left-radius:0.12rem;
  border-top-right-radius:0.12rem;
  overflow: hidden;
}
.item_top_img{
  width:6.58rem;
  height:2.4rem;
  vertical-align: top;
}
.item_des{
  margin:0.2rem;
}
.item_des-save{
  @include flexCenter;
  justify-content: space-between;
  margin-bottom: 0.1rem;
}
.des_save_up{
  font-size: 0.28rem;
  line-height: 0.35rem;
  color:$black;
  font-weight: bold;
}
.des_valid_to{
  font-size: 0.18rem;
  line-height: 0.22rem;
  color:$lighterBlack;
}
.des_up_to{
  width:98%;
  font-size: 0.22rem;
  line-height: 0.26rem;
  color:$lightBlack;
  font-weight: bold;
}
</style>
