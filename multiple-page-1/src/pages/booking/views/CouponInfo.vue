<template>
  <div>
    <div class="coupon-info">
      <p class="coupon-info-title">Apply Coupon</p>
      <div class="coupon-info-code">
        <input type="text" name="couponCode" class="coupon-info-input" v-model="couponCode">
        <button class="btn coupon-info-btn" @click="getCouponInfo">Apply</button>
      </div>
      <div class="coupon-info-codeDetails" v-if="couponInfo.isCouponUse">
        <div class="coupon-info-codeDetails-success">
          <p class="coupon-info-codeDetails-success-num">
            <i class="s-icon s-icon-nike"></i>
            Coupon:{{couponCode}}
          </p>
          <p class="coupon-info-codeDetails-success-price">saved Rs {{couponInfo.couponMap.tradeAmount}}</p>
        </div>
        <div class="coupon-info-code-remove" @click="removeCoupon">remove</div>
      </div>
      <div class="coupon-info-codeDetails-fail" v-if="couponInfo.couponFailMsg">
        <p class="coupon-info-codeDetails-fail-text">{{couponInfo.couponFailMsg}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  // props: ['flightInfo'],
  data () {
    return {
      couponCode: ''
    }
  },
  computed: {
    ...mapState({
      couponInfo: state => state.couponInfo,
    }),

    // couponCode: {
    //   get () {
    //     return this.couponInfo.couponCode;
    //   },
    //   set (val) {
    //     this.setCouponInfo({ couponCode: val });
    //   }
    // }
  },
  methods: {
    ...mapActions(['getCoupon']),
    ...mapMutations(['setCouponInfo']),
    getCouponInfo () {
      this.setCouponInfo({ couponCode: this.couponCode });
      this.getCoupon();
    },
    removeCoupon () {
      this.setCouponInfo({ couponCode: '', couponFailMsg: '', isCouponUse: false, couponMap: {} });
      this.couponCode = '';
    }
  },
}
</script>

<style lang="scss" scoped>
  .coupon-info{
    padding: 0 0.3rem;
  }
  .coupon-info-title{
    font-size: $h3;
    line-height: 30px;
    color: #666;
    font-weight: 700;
    margin-bottom: 5px;
  }
  .coupon-info-code{
    display: flex;
  }
  .coupon-info-input{
    width:4.6rem;
    height:0.54rem;
    // background:rgba(216,216,216,1);
    border-bottom:0.01rem solid rgba(220,220,220,1);
    margin-right: 0.2rem;
    font-size: $h4;
  }
  .coupon-info-btn{
    width:1.8rem;
    height:0.54rem;
    background:rgba(227,164,40,1);
    border-radius:0.08rem;
    font-size: $h6;
    color: white;
    font-weight: 700;
    &:active{
      background: #CB9323;
    }
  }
  .coupon-info-codeDetails-success{
    display: flex;
    margin: 0.3rem 0 0.1rem;
  }
  .coupon-info-codeDetails-success-num{
    width: 60%;
    font-size: $h6;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
  }
  .coupon-info-codeDetails-success-price{
    width: 40%;
    text-align: right;
    font-size: $h4;
    color:rgba(17,17,17,1);
    line-height:0.35rem;
  }
  .coupon-info-codeDetails-fail{
    margin: 0.2rem 0 0.1rem;
  }
  .coupon-info-codeDetails-fail-text{
    font-size: $h6;
    color: red;
  }
  .coupon-info-code-remove{
    font-size: $h5;
    color:$green;
    line-height:0.35rem;
    text-align: right;
  }
</style>
