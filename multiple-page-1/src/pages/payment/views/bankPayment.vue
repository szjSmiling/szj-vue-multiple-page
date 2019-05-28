<template>
  <div class="bank-payment">
    <div class="bank-payment-title" :class="showpayForm ? 'active' : ''" @click="isShowBankpay">
      <p class="bank-payment-title-text">{{netBank.title}}</p>
      <div class="bank-payment-title-img">
        <template v-for="(item, index) in netBank.hotBank">
          <img v-if="index < 4" :key="item.id" :src="item.bankpic" alt="">
        </template>
        <img class="more_img" v-if="netBank.hotBank && netBank.hotBank.length > 4" :src="require('../images/more.png')" alt="">
      </div>
    </div>
    <vertical-toggle>
      <div v-if="showpayForm">
         <div class="bank-payment-from">
          <div class="bank-payment-from-cardType" v-if="netBank.hotBank.length > 0">
            <div class="bank-payment-from-cardType-select" v-for="(val, index) in netBank.hotBank" :key="index">
              <label :for="'bankType'+val.id" class="bank-payment-info-label">
                <i class="s-icon" :class="netBank.selectId == val.id ? 's-icon-checked' : 's-icon-unchecked'"></i>
                &nbsp;<img :src="val.bankpic" alt="" style="width:1.4rem;height:0.28rem;vertical-align:middle;">
              </label>
              <input name="bankType" class="hide" :id="'bankType'+val.id" type="radio" v-model="netBank.selectId" :value="val.id"/>
            </div>
          </div>
          <div style="margin-bottom:0.3rem;">
            <p class="bank-payment-from-text">Choose your bank</p>
            <div>
              <select class="bank-payment-from-select" v-model="netBank.selectId">
                <option v-for="item in netBank.bankList" :key="item.id" :value="item.id">{{item.bankName}}</option>
              </select>
            </div>
          </div>
          <p class="tip_word" style="width:100%;height:14px;">{{netBank.description}}</p>
          <div class="bank-payment-submit">
            <button class="btn bank-payment-submit-btn"
            :disabled="disabled" :class="{bank_disabled: disabled}"
            @click="confirmPayment">Continue</button>
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
  props: ['showType', 'netBank'],
  data () {
    return {
      disabled: true,
      showpayForm: this.showType
    }
  },
  watch: {
    showType (val) {
      this.showpayForm = val;
    },
    'netBank.selectId' (val) {
      if (val) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  },
  methods: {
    isShowBankpay () {
      this.showpayForm = !this.showpayForm;
      this.$emit('eventBankPay', 'bank');
    },
    confirmPayment () {
      let payTransactionMapEncode = {};
      payTransactionMapEncode[3] = Object.assign({},
        { paymentChannel: 3 },
        { paymentBank: this.netBank.selectId }
      );
      this.$emit('confirmpaymentH', payTransactionMapEncode);
    }
  }
}
</script>
<style lang="scss" scoped>
  .bank-payment{
    width:100%;
    font-size:0.24rem;
    background:rgba(250,250,250,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    margin-top: 0.2rem;
  }
  .s-bankPayment-general{
    font-size:0.24rem;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
    margin-top: 0.3rem;
    &.noMarT{
      margin-top: 0rem;
    }
  }
  .bank-payment-title{
    display: flex;
    justify-content: space-between;
    width:100%;
    height:0.82rem;
    line-height: 0.82rem;
    padding: 0 0.3rem;
    &.active{
      background:rgba(1,121,89,0.1);
      .bank-payment-title-text{
        font-weight:bold;
        color:$green;
      }
    }
  }
  .bank-payment-title-text{
    font-size:0.26rem;
    color:rgba(17,17,17,1);
  }
  .bank-payment-title-img{
    text-align: right;
    img{
      height:0.2rem;
      margin-right: 0.1rem;
      vertical-align: middle;
    }
    .more_img{
      height:3px;
      margin-left: 0.1rem;
    }
  }
  .bank-payment-from{
    padding:0.3rem 0.2rem 0.4rem;
    // height: 4.8rem;
  }
  .bank-payment-from-cardType{
    display: flex;
    flex-wrap:wrap;
  }
  .bank-payment-from-cardType-select{
    width: 50%;
    height: 0.6rem;
    margin-bottom: 0.3rem;
  }
  .bank-payment-info-label{
    width:2.4rem;
    height:0.6rem;
    line-height: 0.4rem;
    background:rgba(255,255,255,1);
    border-radius:0.08rem;
    border:0.01rem solid rgba(220,220,220,1);
    padding: 0.1rem 0 0.1rem 0.2rem;
    display: inline-block;
    box-sizing: border-box;
    .s-icon{
      margin-right: 0.2rem;
      vertical-align: middle;
    }
  }
  .bank-payment-from-text{
    font-size:0.24rem;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
    margin-bottom: 0.1rem;
  }
  .bank-payment-from-select{
    width:6.2rem;
    height:0.6rem;
    background:rgba(255,255,255,1);
    border-radius:0.08rem;
    border:0.01rem solid rgba(220,220,220,1);
  }
  .bank-payment-submit-btn{
    display: inline-block;
    text-align: center;
    width:6.2rem;
    height:0.9rem;
    background:rgba(227,164,40,1);
    border-radius:0.12rem;
    font-size:0.36rem;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:0.9rem;
    margin-top: 0.3rem;
    &:active{
      background:#CB9323;
    }
  }
  .bank_disabled{
    cursor: default;
    background: #eee;
  }
</style>
