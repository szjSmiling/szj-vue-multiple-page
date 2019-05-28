<template>
  <div>
    <div class="summary-info">
      <p class="summary-info-title">Checkout Summary</p>
      <div class="summary-info-price">
        <p class="summary-info-item">
          <span class="summary-info-item-type">Base Fare</span>
          <span class="summary-info-item-price">&#8377; {{(d_obfp + r_obfp)|addCommas}}</span>
        </p>
        <p class="summary-info-item">
          <span class="summary-info-item-type">Taxes & Fees</span>
          <span class="summary-info-item-price">&#8377; {{(d_ogst + r_ogst)|addCommas}}</span>
        </p>
        <p class="summary-info-item">
          <span class="summary-info-item-type">Customer Prome</span>
          <span class="summary-info-item-price"> - &#8377; {{(d_obfp + r_obfp - d_bfp - r_bfp)|addCommas}}</span>
        </p>
        <p class="summary-info-item">
          <span class="summary-info-item-type">Convenience Fee</span>
          <span class="summary-info-item-price">&#8377; {{(d_cf + r_cf)|addCommas}}</span>
        </p>
        <p class="summary-info-item" v-show="insurancePri !== 0">
          <span class="summary-info-item-type">Secure Trip x{{pConut}}</span>
          <span class="summary-info-item-price">&#8377; {{insurancePri |addCommas}}</span>
        </p>
        <p class="summary-info-item" v-if="couponInfo.isCouponUse">
          <span class="summary-info-item-type">Coupon</span>
          <span class="summary-info-item-price green">- &#8377; {{couponAmount}}</span>
        </p>
      </div>
      <p class="summary-info-totalPrice">
        <span>Grand Total</span>
        <span class="summary-info-totalPrice-text">&#8377; {{totalPri | addCommas}}</span>
      </p>
      <div class="summary-info-checkOut">
        <button @click="toCheckOut" class="btn summary-info-checkOut-btn">Proceed to Checkout</button>
      </div>
      <div class="summary-info-tc">
        <input type="checkbox" class="hide" v-model="isChecked" id="TC-checkbox">
        <label for="TC-checkbox"><i class="s-icon summary-info-gst-check" :class="isChecked ? 's-icon-select' : 's-icon-unselect'"></i> &nbsp; I agree to the </label><span @click="showTC" class="a_link">terms &amp; conditions</span>
      </div>
    </div>
    <transition name="modal-slide">
      <modal v-if="isShowModel" :errorMsg = "errorMsg" :modalType = "modalType"></modal>
    </transition>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui';
import EventHub from '@/utils/EventHub';
// import modal from './modal';
import { checkPassenger, saveOrder } from '@/constants/ApiConstants';
import { mapState } from 'vuex';
export default {
  props: ['flightInfo'],
  components: {
    modal: () => import('./modal')
  },
  data () {
    return {
      isChecked: true,
      adult: 0,
      cabinClass: '',
      d_obfp: 0,
      r_obfp: 0,
      d_bfp: 0,
      r_bfp: 0,
      d_ogst: 0,
      r_ogst: 0,
      d_cf: 0,
      r_cf: 0,
      d_oprs: 0,
      r_oprs: 0,
      pConut: 0,
      operateOrderTimer: undefined,
      flightDates: [],
      isShowModel: false,
      errorMsg: '',
      modalType: null
    }
  },
  computed: {
    ...mapState({
      insurancePri (state) {
        return state.insurance.checked
          ? (this.flightInfo.isIntl ? state.insurance.days : 1) * state.insurance.price * this.pConut : 0
      },
      days: state => state.insurance.days || 0,
      couponInfo: state => state.couponInfo,
      couponAmount: state => state.couponInfo.couponMap.tradeAmount || 0,
      viaCheck: state => state.viaCheck,
    }),
    totalPri () {
      return this.d_bfp + this.r_bfp + this.d_ogst + this.r_ogst + this.d_cf + this.r_cf + this.insurancePri - (this.couponInfo.isCouponUse ? this.couponAmount : 0)
    }
  },
  created () {
    EventHub.$on('isShowModel', (res) => {
      this.isShowModel = res;
    })
  },
  methods: {
    toCheckOut () {
      clearInterval(this.operateOrderTimer);
      clearTimeout(this.checkTimer);
      EventHub.$emit('sendTraveInfo', true);
      EventHub.$emit('sendContactInfo', true);
      EventHub.$emit('sendGstInfo');
      this.checkTimer = setTimeout(() => {
        if (!this.$store.state.traverStatus || !this.$store.state.contactStatus) return false;
        if (!this.isChecked) return false;
        Indicator.open({
          text: 'loading...',
          spinnerType: 'fading-circle'
        });

        if (this.viaCheck) {
          this.birthDef(this.$store.state.traverInfo);
        } else {
          this.operateOrderTimer = setInterval(() => {
            if (this.viaCheck) {
              this.birthDef(this.$store.state.traverInfo);
              clearInterval(this.operateOrderTimer);
            }
          }, 1000);
        }
      }, 0)
    },
    birthDef (traverInfo) {
      const sendData = {
        flightPsrs: {},
        flightDates: this.flightDates
      }
      traverInfo.forEach(function (val, index) {
        const bir = val.birthDate.split('-');
        const birthDate = bir.length === 1 ? '' : bir[2] + '-' + bir[1] + '-' + bir[0]
        const Obj = {
          birthDate: birthDate,
          passengerType: val.passengerType
        };
        sendData.flightPsrs[index] = Obj;
      });
      this.$http.post(checkPassenger, sendData).then((res) => {
        if (!res.success) {
          var errorInfo = {
            1: 'Adult\'s age shall not be less than 12 on the date of travel.',
            2: 'Child\'s age must be between 2 and 11 on the date of travel.',
            3: 'Infant\'s age must be less than 2 and more than 14 days on the date of travel.',
          };
          Indicator.close();
          this.isShowModel = true;
          this.modalType = 1;
          for (let i in res.flightPsrs) {
            this.errorMsg = errorInfo[res.flightPsrs[i].passengerType];
            break;
          }
        } else {
          this.setSendData();
        }
      })
    },
    setSendData () {
      var orderInfo = {
        departFlight: this.flightInfo.departFlight,
        flightOrder: {
          days: this.days,
          insurance: !!this.insurancePri,
          serviceCount: 0,
          supplieId: 0
        },
        ordersGSTInfo: null,
        requestFromClient: this.flightInfo.requestFromClient,
        returnCash: this.flightInfo.returnCash,
        rtd: null,
        taskToken: this.flightInfo.taskToken,
        token: this.flightInfo.token,
        type: this.flightInfo.type,
      }
      const flightPsrList = this.$store.state.traverInfo.map(ele => {
        const bir = ele.birthDate.split('-');
        const birthDate = bir.length === 1 ? '' : bir[2] + '-' + bir[1] + '-' + bir[0]
        const card = ele.cardValid.split('-');
        const cardValid = card.length === 1 ? '' : card[2] + '-' + card[1] + '-' + card[0];
        return { ...ele, ...{ birthDate, cardValid } }
      });
      orderInfo.flightOrder.flightPsrList = flightPsrList;

      orderInfo.flightOrder.payTransactionMap = this.couponInfo.isCouponUse ? { 1: this.couponInfo.couponMap } : {};
      Object.assign(orderInfo.flightOrder, this.$store.state.contactInfo);
      this.saveOrder(orderInfo);
    },
    saveOrder (sendData) {
      this.$http.post(saveOrder, sendData, {
        headers: {
          'Content-Type': 'application/json',
          'x-Device': 'mobile'
        }
      }).then((res) => {
        if (res.success) {
          Indicator.close();
          window.location.href = `/payment/${res.orderId}/${sendData.flightOrder.contactMob}?viewChange=${res.PriceView.changedView.viewChange}`;
        } else if (res.code === 9) {
          this.isShowModel = true;
          this.modalType = 2;
          this.errorMsg = res.msg;
        } else if (res.code === 7) {
          this.isShowModel = true;
          this.modalType = 2;
          this.errorMsg = 'Your session has expired. Please click Continue to reload.';
        } else {
          this.isShowModel = true;
          this.modalType = 2;
          this.errorMsg = res.msg + ' : Redirecting to Search Page...';
        }
      })
    },
    showTC () {
      EventHub.$emit('isShowTC', true);
    },
  },
  watch: {
    flightInfo (val) {
      const _this = this;
      this.adult = val.requestFromClient.adults;
      this.cabinClass = val.requestFromClient.cabinClass;
      this.d_oprs = Number(val.departFlight.opr);
      this.r_oprs = val.returnFlight !== undefined ? Number(val.returnFlight.opr) : 0;
      this.d_obfp = Number(val.departFlight.fee.obfp);
      this.r_obfp = val.returnFlight !== undefined ? Number(val.returnFlight.fee.obfp) : 0;
      this.d_bfp = Number(val.departFlight.fee.bfp);
      this.r_bfp = val.returnFlight !== undefined ? Number(val.returnFlight.fee.bfp) : 0;
      this.d_ogst = Number(val.departFlight.fee.ogst);
      this.r_ogst = val.returnFlight !== undefined ? Number(val.returnFlight.fee.ogst) : 0;
      this.d_cf = Number(val.departFlight.fee.cf);
      this.r_cf = val.returnFlight !== undefined ? Number(val.returnFlight.fee.cf) : 0;
      this.pConut = val.requestFromClient.adults + val.requestFromClient.baby + val.requestFromClient.childs;
      function getflightDates (data) {
        data.forEach(function (value) {
          value.dd = value.dt.replace(/\s.*/, '');
          _this.flightDates.push(value.dd.replace(/\//g, '-'));
        })
      }
      getflightDates(val.departFlight.stopByFlightArray);
      if (val.returnFlight !== undefined) {
        getflightDates(val.returnFlight.stopByFlightArray);
      }
    }
  },
}
</script>
<style lang="scss" scoped>

  .summary-info{
    padding: 0 0.3rem;
  }
  .summary-info-title{
    font-size: $h3;
    line-height: 30px;
    color: $lightBlack;
    font-weight: 700;
    margin-bottom: 0.1rem;
  }
  .summary-info-price{
    padding-bottom: 0.3rem;
    border-bottom:0.01rem solid rgba(220,220,220,1);
  }
  .summary-info-item{
    line-height: 0.45rem;
    margin-bottom: 0.2rem;
  }
  .summary-info-item-type{
    display: inline-block;
    width: 60%;
    font-size:$h6;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
  }
  .summary-info-item-price{
    display: inline-block;
    width: 40%;
    font-size: $h3;
    color:rgba(102,102,102,1);
    line-height:0.45rem;
    text-align: right;
    &.green{
      color: $green;
    }
  }
  .summary-info-totalPrice{
    font-size: $h6;
    color:rgba(102,102,102,1);
    line-height:0.3rem;
    text-align: right;
    margin-top: 0.3rem;
  }
  .summary-info-totalPrice-text{
    font-size: $h1;
    font-weight:700;
    color:rgba(0,0,0,1);
    line-height:0.52rem;
    margin-left: 0.15rem;
  }
  .summary-info-checkOut{
    text-align: center;
  }
  .summary-info-checkOut-btn{
    display: inline-block;
    width:6.2rem;
    height:0.9rem;
    background:rgba(227,164,40,1);
    border-radius:0.12rem;
    font-size: $h2;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:0.9rem;
    color: white;
    margin: 0.4rem 0 0.32rem;
    &:active{
      background: #CB9323;
    }
  }
  .summary-info-tc{
    text-align: center;
    margin-bottom: 0.6rem;
    font-size: $h6;
  }
  .summary-info-gst-check{
    vertical-align: middle;
  }
  .s-icon-unselect{
    border:1px solid #f00;
  }
  // 提示框
.modal-slide-enter-active {
  animation: modal-in .5s;
}
.modal-slide-leave-active {
  animation: modal-in .5s reverse;
}
@keyframes modal-in {
  0% {
    transform: translateX(500px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
