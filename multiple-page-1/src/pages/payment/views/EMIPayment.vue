<template>
  <div class="emi-payment">
    <div class="emi-payment-title" :class="showpayForm ? 'active' : ''" @click="isShowUpipay">
      <p class="emi-payment-title-text">{{EMI.title}}</p>
      <div class="emi-payment-title-img">
        <img :src="require('../images/emi.png')" alt="">
      </div>
    </div>
    <vertical-toggle>
      <div v-show="showpayForm">
        <div class="emi-payment-from" >
          <div class="emi-payment-submit">
            <button class="btn emi-payment-submit-btn" @click="confirmPayment">Continue</button>
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
  props: ['showType', 'EMI'],
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
      this.$emit('eventEMIPay', 'emi');
    },
    confirmPayment () {
      let payTransactionMapEncode = {};
      payTransactionMapEncode[3] = Object.assign({}, { paymentChannel: 5 });
      this.$emit('confirmpaymentH', payTransactionMapEncode);
    }
  }
}
</script>
<style lang="scss" scoped>
  .emi-payment{
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
  .emi-payment-title{
    display: flex;
    justify-content: space-between;
    width:100%;
    height:0.82rem;
    line-height: 0.82rem;
    padding: 0 0.3rem;
    &.active{
      background:rgba(1,121,89,0.1);
      .emi-payment-title-text{
        font-weight:bold;
        color:$green;
      }
    }
  }
  .emi-payment-title-text{
    font-size:0.26rem;
    color:rgba(17,17,17,1);
  }
  .emi-payment-title-img{
    img{
      height:0.2rem;
      margin-right: 0.1rem;
      vertical-align: middle;
    }
    span{
      margin-left: 0.1rem;
    }
  }
  .emi-payment-from{
    padding: 0.3rem 0.2rem 0.4rem;
  }
  .emi-payment-submit-btn{
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
