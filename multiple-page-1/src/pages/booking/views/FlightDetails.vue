
<template>
  <div>
    <div class="flight-details">
      <p class="flight-details-title">Finish booking</p>
      <div class="flight-details-info" >
        <div class="flight-details-trip">
          <span class="flight-details-trip-place">
            {{flightItem.dc}} ({{flightItem.ds}}) - {{flightItem.ac}} ({{flightItem.as}})</span>
          <span class="flight-details-trip-type general-css">{{flightInfo2.length == 1 ? 'Oneway' : 'Roundtrip'}}</span>
        </div>
        <div class="flight-details-date general-css">{{flightDate(flightItem.dt)}} - {{flightDate(flightItem.at)}}</div>
        <div class="flight-details-travel">
          <span class="flight-details-travel-num general-css">{{travellerString}} , {{flightItem2.cabinClass}}</span>
          <span class="flight-details-travel-details" @click="showDetail = !showDetail">flight detail&nbsp; <i class="s-icon" :class="showDetail ? 's-icon-up' : 's-icon-down' "></i></span>
        </div>
         <vertical-toggle>
          <div class="flight-details-show" v-show="showDetail">
            <TripInfo :flightInfo='flightInfo2'></TripInfo>
          </div>
        </vertical-toggle>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */ 
import VerticalToggle from '@/utils/vertical-toggle.js';
import TripInfo from './TripInfo';
import EvnetHub from '@/utils/EventHub';
export default {
  props:["flightInfo"],
  data (){
    return {
      showDetail : false,
      flightDetail: [],
      flightInfo2:[],
      flightItem:{},
      flightItem2: {
        adults : 0,
        cabinClass : ''
      },
      goBag: {
        ca: 0,
        ch: 0
      },
      roundBag: {
        ca: 0,
        ch: 0
      }
    }
  },
  components:{
    VerticalToggle,
    TripInfo
  },
  computed:{
    travellerString(){
      if(!this.flightInfo.requestFromClient) return '';
      const {adults:numAdult, childs:numChild, baby:numInfant} = this.flightInfo.requestFromClient;
      let strTraveller = `${numAdult} ${numAdult > 1 ? 'Adults ' : 'Adult '}`
      strTraveller += numChild > 0 ? numChild + (numChild > 1 ? 'Childs ' : 'Child ') : '';
      strTraveller += numInfant > 0 ? numInfant + (numInfant > 1 ? 'Infants ' : 'Infant ') : '';
      return strTraveller;
    }
  },
  methods: {
    flightDate (fDate) {
      let flightDate = new Date(fDate).toString();
      return flightDate.slice(0, 3) + ', ' + flightDate.slice(4, 11) + ', ' + flightDate.slice(11, 16)
    },

  },
  watch: {
    flightInfo(val){
      this.flightDetail = [];
      val.departFlight.isIntl = val.isIntl;
      val.departFlight.baggageInfo = val.departFlight.stopByFlightArray[0].baggageInfo;
      this.flightDetail.push(val.departFlight)

      this.token = val.token;
      this.flightItem = val.departFlight;
      this.flightItem2.adults = val.requestFromClient.adults;
      this.flightItem2.cabinClass = val.requestFromClient.cabinClass;
      if (val.returnFlight !== undefined) {
        val.returnFlight.isIntl = val.isIntl;
        val.returnFlight.baggageInfo = val.returnFlight.stopByFlightArray[0].baggageInfo;
        this.flightDetail.push(val.returnFlight);
      }
      this.flightInfo2 =  this.flightDetail;
    }
  }  
}
</script>

<style lang="scss" scoped>
 // eslint-disable
  .general-css{
    font-size: $h4;
    color: $lightBlack;
  }
  .flight-details{
    padding:0.2rem 15px 0;
  }
  .flight-details-title{
    font-size: $h3;
    line-height: 30px;
    color: $lightBlack;
    font-weight: 700;
  }
  .flight-details-info{
    padding-bottom: 10px;
    border-bottom: 1px solid #DCDCDC;
  }
  .flight-details-trip,
  .flight-details-travel{
    display: flex;
    line-height: 30px;
  }
  .flight-details-trip-place{
    color: #000;
    font-size: $h2;
    font-weight: 700;
    width: 80%;
  }
  .flight-details-trip-type{
    text-align: right;
    width: 20%;
    font-size: $h6;
  }
  .flight-details-date{
    line-height: 30px;
    font-size: $h4;
  }
  .flight-details-travel-num{
    width: 60%;
  }
  .flight-details-travel-details{
    text-align: right;
    width: 40%;
    font-size: $h5;
    color: $green;
  }
</style>
