<template>
  <div class="paypal-payment">
    <div class="paypal-payment-title" :class="showpayForm ? 'active' : ''" @click="isShowUpipay">
      <p class="paypal-payment-title-text">{{paypal.title}}</p>
      <div class="paypal-payment-title-img">
        <img :src="require('../images/paypal.png')" alt="">
      </div>
    </div>
    <vertical-toggle>
      <div v-show="showpayForm">
        <div class="paypal-payment-from" >
          <div class="paypal-payment-submit">
            <button class="btn paypal-payment-submit-btn" @click="confirmPayment">Continue</button>
          </div>
        </div>
      </div>
    </vertical-toggle>
  </div>
</template>
<script>
import VerticalToggle from '@/utils/vertical-toggle.js';
export default {
  components: {
    VerticalToggle
  },
  props: ['showType', 'paypal'],
  data () {
    return {
      showpayForm: this.showType
    }
  },
  watch: {
    showType (val) {
      this.showpayForm = val;
    }
  },
  methods: {
    isShowUpipay () {
      this.showpayForm = !this.showpayForm;
      this.$emit('eventPaypalPay', 'paypal');
    },
    confirmPayment () {
      let payTransactionMapEncode = {};
      payTransactionMapEncode[3] = Object.assign({}, { paymentChannel: 7 });
      this.$emit('confirmpaymentH', payTransactionMapEncode);
    }
  }
}
</script>
<style lang="scss" scoped>
  .paypal-payment{
    width:100%;
    background:rgba(250,250,250,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    margin-top: 0.2rem;
  }
  .s-upiPayment-general{
    font-size: 0.24rem;
    color: #666666;
    line-height: 0.3rem;
    margin-bottom: 0.1rem;
  }
  .paypal-payment-title{
    display: flex;
    justify-content: space-between;
    width:100%;
    height:0.82rem;
    line-height: 0.82rem;
    padding: 0 0.3rem;
    &.active{
      background:rgba(1,121,89,0.1);
      .paypal-payment-title-text{
        font-weight:bold;
        color:$green;
      }
    }
  }
  .paypal-payment-title-text{
    font-size:0.26rem;
    color:rgba(17,17,17,1);
  }
  .paypal-payment-title-img{
    img{
      height:0.2rem;
      margin-right: 0.1rem;
      vertical-align: middle;
    }
    span{
      margin-left: 0.1rem;
    }
  }
  .paypal-payment-from{
    padding: 0.3rem 0.2rem 0.4rem;
  }
  .paypal-payment-submit-btn{
    display: inline-block;
    text-align: center;
    width: 6.2rem;
    height: 0.9rem;
    background: #e3a428;
    border-radius: 0.12rem;
    font-size: 0.36rem;
    font-weight: bold;
    color: white;
    line-height: 0.9rem;
    margin-top: 0.3rem;
    &:active{
      background:#CB9323;
    }
  }
</style>
