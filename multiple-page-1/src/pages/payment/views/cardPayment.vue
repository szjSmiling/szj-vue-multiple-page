<template>
  <div class="card-payment">
    <div class="card-payment-title" :class="showpayForm ? 'active' : ''" @click="isShowCardpay">
      <p class="card-payment-title-text">Card</p>
      <div class="card-payment-title-img">
        <img :src="require('../images/Visa_Logo.png')" alt="">
        <img :src="require('../images/master-card.png')" alt="">
        <img :src="require('../images/card-3.png')" alt="">
        <img class="more_img" :src="require('../images/more.png')" alt="">
      </div>
    </div>
    <vertical-toggle>
      <div v-show="showpayForm">
        <div class="card-payment-from" >
          <div>
            <p class="s-cardPayment-general noMarT">Card Type</p>
            <div class="card-payment-from-cardType">
              <label v-if="credit.isShow" for="male" class="card-payment-info-label"><i class="s-icon" :class="isChecked == 0 ? 's-icon-checked' : 's-icon-unchecked'"></i>&nbsp;{{credit.title}}</label>
              <input v-if="credit.isShow" name="sex" class="hide" id="male" type="radio" value="0" v-model="isChecked"/>
              <label v-if="debit.isShow" for="female" class="card-payment-info-label"><i class="s-icon" :class="isChecked == 1 ? 's-icon-checked' : 's-icon-unchecked'"></i>&nbsp;{{debit.title}}</label>
              <input v-if="debit.isShow" name="sex" class="hide" id="female" value="1" v-model="isChecked" type="radio" />
            </div>
          </div>
          <div class="credit_card_form">
            <div>
              <p class="s-cardPayment-general">Card Number</p>
              <input class="card-payment-number-input" type="text" name="cardNumber" @change="limitBankNumber" v-model="bankInfo.card">
              <!-- <div class="checkError" v-show="bankInfo.errCard">You miss this</div> -->
            </div>
            <div class="card-payment-expiry">
              <div class="card-payment-expiry-date">
                <p class="s-cardPayment-general">Expiry Date</p>
                <div class="card-payment-expiry-date-select">
                  <div>
                    <select name="month" v-model="bankInfo.month" class="card-payment-expiry-date-select-m">
                      <option disabled>mm</option>
                      <option v-for="item in 12" :key="item">{{item | padZero}}</option>
                    </select>
                  </div>
                  <div >
                    <select name="year" v-model="bankInfo.year" class="card-payment-expiry-date-select-m">
                      <option disabled>yyyy</option>
                      <option v-for="i in 23" :key="i" :value="String(new Date().getFullYear() + i -1)">
                        {{new Date().getFullYear() + i -1 }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <p class="s-cardPayment-general">CVV</p>
                <input class="card-payment-expiry-cvv" type="password" maxlength="4" v-model="bankInfo.cvv" name="cvv">
              </div>
            </div>
            <div>
              <p class="s-cardPayment-general">Card Holder’s Name</p>
              <input class="card-payment-number-input" type="text" v-model="bankInfo.holder" name="holder" >
            </div>
            <div class="card-payment-tips">
              <p><i class="s-icon s-icon-calendar"></i></p>
              <p class="card-payment-tips-text">For security reasons, the holder of the international credit card used to book a ticket or group of tickets must be one of the tracellers on that itinerary or have the same family name.</p>
            </div>
            <div class="card-payment-submit">
              <button type="button" class="btn card-payment-submit-btn"
              :disabled="bankInfo.disabled" :class="{card_disabled: bankInfo.disabled}"
              @click="confirmPayment(bankInfo)">Finish Payment</button>
            </div>
          </div>
        </div>
      </div>
    </vertical-toggle>
  </div>
</template>
<script>
import * as Reg from '@/constants/RegularConstants';
import VerticalToggle from '@/utils/vertical-toggle.js';
export default {
  props: ['showType', 'credit', 'debit'],
  components: {
    VerticalToggle
  },
  data () {
    return {
      isChecked: 0,
      selected: '',
      showpayForm: this.showType,
      bankInfo: {
        id: 1,
        card: '',
        holder: '',
        month: '',
        year: '',
        cvv: '',
        testNum: '',
        errCard: false,
        errHolder: false,
        errMonth: false,
        errYear: false,
        errCvv: false,
        disabled: true
      }
    };
  },
  watch: {
    showType (val) {
      this.showpayForm = val;
    },
    bankInfo: {
      handler: (val) => {
        let month = val.month;
        let nowMonth = (new Date()).getMonth() + 1;
        let nowYear = (new Date()).getFullYear();
        if (val && !(/^\d*$/g).test(val.card)) {
          val.card = val.testNum;
        } else {
          val.testNum = val.card;
        }
        if (val.card.length > 19) {
          val.card = val.card.substr(0, 19);
        }
        if (val.cvv.length >= 4) {
          val.cvv = val.cvv.substr(0, 4);
        }
        if (!Reg.name.test(val.holder.trim())) {
          val.holder = '';
        }
        if (val.card.trim() === '' || val.month === '' || val.year === '' || val.holder.trim() === '' ||
          !Reg.name.test(val.holder.trim()) || val.cvv.trim() === '' || (val.year - nowYear === 0 && month - nowMonth <= 0)
        ) {
          val.errCard = true;
          val.disabled = true;
        } else {
          val.disabled = false;
        }
      },
      deep: true
    }
  },
  methods: {
    isShowCardpay () {
      this.showpayForm = !this.showpayForm;
      this.$emit('eventCardPay', 'card');
    },
    limitBankNumber () {
      // this.bankInfo.card = String(this.bankInfo.card).replace(BankCardAddSpace, '$1 ');
    },
    checkCard (obj) {
      obj.errCard = false;
      obj.errMonth = false;
      obj.errYear = false;
      obj.errCvv = false;
      obj.errHolder = false;
      let flag = true;
      if (obj.card.trim() === '') {
        flag = false;
        obj.errCard = true;
      }
      if (obj.month === '') {
        flag = false;
        obj.errMonth = true;
      }
      if (obj.year === '') {
        flag = false;
        obj.errYear = true;
      }
      if (!Reg.name.test(obj.holder.trim())) {
        flag = false;
        obj.errHolder = true;
      }
      if (obj.cvv.trim() === '') {
        flag = false;
        obj.errCvv = true;
      }
      let month = obj.month;
      let nowMonth = (new Date()).getMonth() + 1;
      let nowYear = (new Date()).getFullYear();
      if (obj.year - nowYear <= 0 && month - nowMonth <= 0) {
        flag = false;
        obj.errMonth = true;
        obj.errYear = true;
      }
      return flag;
    },
    confirmPayment (data) {
      if (!this.checkCard(data)) return false;
      this.bankInfo.disabled = false;
      let formData = {
        name_on_card: data.holder,
        card_number: data.card,
        card_cvv: data.cvv,
        card_yyyy: data.year,
        card_mm: data.month
      };
      data.id = !this.isChecked ? 1 : 2;
      let payTransactionMapEncode = {};
      payTransactionMapEncode[3] = Object.assign({}, { paymentChannel: data.id }, formData);
      this.$emit('confirmpaymentH', payTransactionMapEncode);
    }
  }
};
</script>
<style lang="scss" scoped>
  .card-payment{
    width:100%;
    font-size:0.24rem;
    background:rgba(250,250,250,1);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    margin-top: 0.2rem;
  }
  .s-cardPayment-general{
    font-size:0.24rem;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
    margin-top: 0.3rem;
    &.noMarT{
      margin-top: 0rem;
    }
  }
  .card-payment-title{
    display: flex;
    justify-content: space-between;
    width:100%;
    height:0.82rem;
    line-height: 0.82rem;
    padding: 0 0.3rem;
    &.active{
      background:rgba(1,121,89,0.1);
      .card-payment-title-text{
        font-weight:bold;
        color:$green;
      }
    }
  }
  .card-payment-title-text{
    font-size:0.26rem;
    color:rgba(17,17,17,1);
  }
  .card-payment-title-img{
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
  .card-payment-from{
    padding:0.3rem 0.2rem 0.4rem;
    height: 8.6rem;
  }
  .card-payment-from-cardType{
    margin-top: 0.22rem;
  }
  .card-payment-info-label{
    color:rgba(17,17,17,1);
    line-height:0.4rem;
    margin-right: 0.6rem;
    .s-icon{
      margin-right: 0.1rem;
      vertical-align: middle;
    }
  }
  .card-payment-number-input{
    width:100%;
    height:0.6rem;
    background:rgba(255,255,255,1);
    border-radius:0.08rem;
    border:0.01rem solid rgba(220,220,220,1);
    margin-top: 0.1rem;
    padding: 0.1rem 0.2rem;
  }
  .card-payment-expiry{
    display: flex;
  }
  .card-payment-expiry-date-select{
    display: flex;
    margin-top: 0.1rem;
  }
  .card-payment-expiry-date-select-m{
    width:1.6rem;
    height:0.6rem;
    background:rgba(255,255,255,1);
    border-radius:0.08rem;
    border:0.01rem solid rgba(220,220,220,1);
    margin-right: 0.1rem;
    padding-left: 0.2rem;
  }
  .card-payment-expiry-cvv{
    width:2.8rem;
    height:0.6rem;
    background:rgba(255,255,255,1);
    border-radius:0.08rem;
    border:0.01rem solid rgba(220,220,220,1);
    padding: 0.1rem 0.2rem;
    margin-top: 0.1rem;
  }
  .card-payment-tips{
    margin-top: 0.3rem;
  }
  .card-payment-tips-text{
    font-size: 0.24rem;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
    margin-top: 0.2rem;
  }
  .card-payment-submit-btn{
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
    cursor: pointer;
    &:active{
      background:#CB9323;
    }
  }
  .card_disabled{
    cursor: default;
    background: #eee;
  }

</style>
