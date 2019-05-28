<template>
  <div class="coupon_box">
    <div class="coupon_page" v-if="couponInfo">
      <div class="coupon_introduction">
        <h4>{{couponInfo.title}}</h4>
        <p v-html="couponInfo.description">{{couponInfo.description}}</p>
      </div>
      <div class="coupon_top">
        <div class="coupon_code">
          <p>Coupon code</p>
          <p>{{couponInfo.couponCode}}</p>
        </div>
        <div class="coupon_date">
          <p>Validation date</p>
          <p>{{`${getDayMonthYearString(new Date(couponInfo.startDate))} - ${getDayMonthYearString(new Date(couponInfo.endDate))}`}}</p>
        </div>
      </div>
      <div class="coupon_tc">
        <div v-html="couponInfo.tc">{{couponInfo.tc}}</div>
      </div>
      <div class="book_btn">
        <a href="/">Book Now</a>
      </div>
    </div>
    <Foot />
</div>
</template>
<script>
import { Indicator, Toast } from 'mint-ui';
import { hasItem, getItem } from '@/utils/CookieUtils';
import { getDayMonthYearString } from '@/utils/DateFormatUtils';
export default {
  components: {
    Foot: () => import('@/components/Foot.vue')
  },
  data () {
    return {
      getDayMonthYearString,
      couponInfo: null
    }
  },
  created () {
    Indicator.open({
      spinnerType: 'fading-circle'
    })
    let params = this.$route.query;
    let url = `/heg_api/coupon/getCouponPromnByCode.do?code=${params.code}&type=2&platform=${hasItem('platform') ? getItem('platform') : '065626cf-a5a9-4ae8-ba71-ed5f4b8b748d'}`;
    this.$http(url, {
      headers: {
        'x-Device': 'mobile'
      }
    }).then(res => {
      Indicator.close();
      if (res.code === 200 && res.data.length > 0) {
        this.couponInfo = res.data[0];
      } else {
        Toast(res.msg);
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.home-logo{
  position: absolute;
  bottom: 0;
  left: 0;
}
.coupon_box{
  height:100%;
  position: relative;
  overflow: hidden;
}
.coupon_page{
  padding:0.3rem 0.3rem 1.68rem;
  height:100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.coupon_top{
  padding:0.3rem 0.2rem;
  margin:0.4rem 0;
  background:rgba(1,121,89,0.1);
  border-radius:6px;
}
.coupon_code, .coupon_date{
  @include flexCenter;
  justify-content: space-between;
}
.coupon_code{
  margin-bottom: 0.3rem;
}
.coupon_code p:first-child, .coupon_date p:first-child{
  font-size: 12px;
  font-weight: bold;
  color:$lightBlack;
}
.coupon_code p:last-child, .coupon_date p:last-child{
  font-size:16px;
  font-weight:bold;
  color:rgba(1,121,89,1);
}
.coupon_introduction h4{
  font-size: 0.36rem;
  font-weight:bold;
  color:rgba(102,102,102,1);
  padding:0.27rem 0 0.4rem;
}
/* introduction */
.coupon_introduction{
  font-weight: bold;
  font-size: 0.22rem;
  line-height:0.33rem;
}

/* button */
.book_btn{
  padding-top: 0.4rem;
  a{
    display: block;
    width:6.2rem;
    height:0.9rem;
    line-height:0.9rem;
    margin:auto;
    text-align: center;
    font-size:0.36rem;
    font-weight:bold;
    color:rgba(255,255,255,1);
    background:rgba(227,164,40,1);
    border-radius:0.12rem;
    cursor: pointer;
    &:active{
      background:#CB9323;
    }
  }
}
</style>
