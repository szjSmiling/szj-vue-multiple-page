<template>
  <div class="traveler-details">
    <form>
      <p class="traveler-details-title">Traveler Details</p>
      <p class="traveler-details-import">Important: Please enter names as mentioned on your government ID proof.</p>
      <travelersInfo :flightInfo = 'flightInfo'></travelersInfo>
      <contactInfo/>
      <GstInfo />
    </form>
    <insureInfo v-if="hasInsurance" :flightInfo = 'flightInfo'></insureInfo>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import travelersInfo from './TravelersInfo'
import contactInfo from './ContactInfo'
import insureInfo from './InsureInfo'
import GstInfo from './GstInfo';
import { hasInsurance } from '@/constants/ApiConstants';

export default {
  props: ['flightInfo'],
  data () {
    return {
      hasInsurance: false
    }
  },
  components: {
    travelersInfo,
    contactInfo,
    insureInfo,
    GstInfo
  },
  methods: {
    ...mapMutations(['setInsurance']),
    getInsure (parame) {
      this.$http.post(hasInsurance, parame).then((res) => {
        if (res.success) {
          this.hasInsurance = true;
          const price = res.data.productInfoList[0].disPrice;
          const orignPirce = res.data.productInfoList[0].price;
          const days = res.data.days;
          const checked = res.data.hasInsurance;
          this.setInsurance({ price, days, checked, orignPirce })
        }
      })
    }
  },
  watch: {
    flightInfo (val) {
      let reqData = {
        token: val.token,
        passengerCount: val.travellers,
        from: val.departFlight.ds,
        to: val.departFlight.as,
        international: val.isIntl,
        departFlightList: [
          {
            departDateTime: val.departFlight.dt,
            wdt: val.departFlight.wdt,
            arrDateTime: val.departFlight.at
          }
        ]
      };
      if (val.returnFlight && Object.keys(val.returnFlight).length !== 0) {
        reqData.returnFlightList = [
          {
            departDateTime: val.returnFlight.dt,
            arrDateTime: val.returnFlight.at,
            wdt: val.returnFlight.wdt
          }
        ];
      }
      this.getInsure(reqData);
    }
  },
}
</script>
<style lang="scss">
  .errorText{
    position: absolute;
    right: 0.2rem;
    top: 0.1rem;
    font-size: 0.22rem;
    color: #d60d0d;
  }
  .red-border{
    border: 1px solid #d60d0d !important;
    &:focus{
      border: 1px solid rgba(1,121,89,1) !important;
    }
  }
</style>

<style lang="scss" scoped>
  .traveler-details{
    padding: 10px 15px;
  }
  .traveler-details-title{
    font-size: $h4;
    line-height: 30px;
    color: $lightBlack;
    font-weight: 700;
  }
  .traveler-details-import{
    color: $lightBlack;
    font-size: $h5;
    line-height: 15px;
  }
</style>
