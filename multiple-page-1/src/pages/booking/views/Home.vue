<template>
  <div>
    <FlightDetails :flightInfo="flightInfo"></FlightDetails>
    <TravelerDetails :flightInfo="flightInfo"></TravelerDetails>
    <couponInfo />
    <summaryInfo :flightInfo="flightInfo"></summaryInfo>
    <transition name="tc-slide">
      <terms-condition v-if="isShowTC"></terms-condition>
    </transition>
    <transition name="modal-slide">
      <modal v-if="isShowModel" :errorMsg = "errorMsg" :modalType = "modalType"></modal>
    </transition>
    <Foot/>
  </div>
</template>
<script>
import FlightDetails from './FlightDetails';
import TravelerDetails from './TravelerDetails';
import couponInfo from './CouponInfo';
import summaryInfo from './SummaryInfo';
import EventHub from '@/utils/EventHub';
import Foot from '@/components/Foot';
import { getFlights, getCheckResult, checkCountAndPrice } from '@/constants/ApiConstants';
import { mapMutations, mapGetters, mapActions } from 'vuex';
// import { mapMutations } from 'vuex';
export default {
  name: 'Home',
  data () {
    return {
      isShowTC: false,
      isShowModel: false,
      errorMsg: '',
      modalType: 1
    };
  },
  components: {
    FlightDetails,
    TravelerDetails,
    couponInfo,
    summaryInfo,
    Foot,
    TermsCondition: () => import('./TermsCondition.vue'),
    modal: () => import('./modal')
  },
  computed: {
    ...mapGetters(['flightInfo']),
  },
  created () {
    EventHub.$on('isShowTC', (val) => {
      this.isShowTC = val;
    });
    EventHub.$on('isShowModel', (val) => {
      this.isShowModel = val;
    });
    this.getFlight();
  },
  methods: {
    ...mapMutations(['setFlightInfo', 'setNewFlightInfo']),
    ...mapActions(['setCheckPrice']),
    getFlight () {
      const token = location.search;
      this.$http(getFlights + token).then((res) => {
        if (res.success) {
          this.setFlightInfo(res.flights);
          this.setNewFlightInfo(res.flights);
          this.bookVerify(this.flightInfo);
        } else if (!res.success && res.code === 7) {
          this.isShowModel = true;
          this.errorMsg = 'Your session has expired. Please click Continue to reload';
          this.modalType = 2;
        } else if (!res.success && res.code === 2) {
          this.isShowModel = true;
          this.errorMsg = 'Request timed out, please requery';
          this.modalType = 2;
        }
      })
    },
    bookVerify (postData) {
      let feeO = {
        obfp: postData.departFlight.fee.obfp,
        ogst: postData.departFlight.fee.ogst,
        bfp: postData.departFlight.fee.bfp,
        gst: postData.departFlight.fee.gst,
        policyDiscount: postData.departFlight.fee.policyDiscount || null,
        intervalDiscount: postData.departFlight.fee.intervalDiscount || null,
        airCompanyDiscount: postData.departFlight.fee.airCompanyDiscount || null
      };
      let sendData = {
        rtd: postData.rtd || null,
        departFlight: postData.departFlight,
        'returnCash': postData.returnCash,
        'requestFromClient': postData.requestFromClient,
        'token': postData.token,
      };
      sendData.departFlight.feeO = feeO;
      if (postData.returnFlight) {
        let feeO = {
          obfp: postData.returnFlight.fee.obfp,
          ogst: postData.returnFlight.fee.ogst,
          bfp: postData.returnFlight.fee.bfp,
          gst: postData.returnFlight.fee.gst,

          policyDiscount: postData.returnFlight.fee.policyDiscount || null,
          intervalDiscount: postData.returnFlight.fee.intervalDiscount || null,
          airCompanyDiscount: postData.returnFlight.fee.airCompanyDiscount || null
        };

        Object.assign(sendData, { returnFlight: postData.returnFlight });
        sendData.returnFlight.feeO = feeO;
      }
      let verifyTimer = 0;

      this.$http.post(checkCountAndPrice, sendData).then((res) => {
        if (res.code === 1) {
          // 更新token
          this.setFlightInfo({ taskToken: res.token });
          this.intervalVerify(res.token, verifyTimer)
        } else {
          this.isShowModel = true;
          this.errorMsg = 'Fare or Seat(s) not available with the airline.Redirecting to Search Page...';
          this.modalType = 2;
        }
      })
    },
    intervalVerify (token, verifyTimer) {
      const _that = this;
      const number = location.search.split('&')[1];
      const url = `${getCheckResult}?token=${token}&${number}`
      this.$http(url).then((res) => {
        if (res.code === 0 || res.code === 1) {
          this.setCheckPrice(res.code); // 通过验证
        } else if (res.code === 9) {
          if (verifyTimer > 28) {
            if (res.proceed) {
              this.setCheckPrice(false)
            } else {
              this.isShowModel = true;
              this.errorMsg = 'Fare or Seat(s) not available with the airline. Redirecting to Search Page...';
              this.modalType = 2;
            }
            return false;
          }
          setTimeout(function () {
            verifyTimer++;
            _that.intervalVerify(token, verifyTimer);
          }, 2000);
        } else {
          this.isShowModel = true;
          this.errorMsg = res.msg === null ? 'Your session has expired. Please click Continue to reload.' : res.msg;
          this.modalType = 2;
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.tc-slide-enter-active {
  animation: bounce-in .5s;
}
.tc-slide-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateX(500px);
  }
  100% {
    transform: translateX(0px);
  }
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
