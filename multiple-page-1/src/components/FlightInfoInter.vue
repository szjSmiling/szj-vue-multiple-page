<template>
  <div class="flight_template">
    <div class="flight_info flight_info1">
      <div class="info_airport">
        <img class="info_airport-img" :src="`/images/${flightInfo.departFlight.al}.png`" alt="">
        <p class="info_airport-name ellipsis">{{flightInfo.departFlight.fn}}</p>
      </div>
      <div class="info_time">
        <div class="info_time-depart">
          <span class="depart_time">{{getHourAndMinute(new Date(flightInfo.departFlight.dt))}}</span>
          <p class="depart_code">{{flightInfo.departFlight.ds}}</p>
        </div>
        <div class="info_time-stop">
          <p class="stop_time">{{flightInfo.departFlight.wdt}}</p>
          <i class="s-icon s-icon-flyto"></i>
          <p class="stop_number" v-if="flightInfo.departFlight.sb > 0">{{flightInfo.departFlight.sb > 1?flightInfo.departFlight.sb+' stops':flightInfo.departFlight.sb+' stop'}}</p>
        </div>
        <div class="info_time-arrive">
          <span class="return_time">{{getHourAndMinute(new Date(flightInfo.departFlight.at))}}</span>
          <p class="return_code">{{flightInfo.departFlight.as}}</p>
        </div>
      </div>
    </div>
    <div class="flight_info flight_info2">
      <div class="info_airport">
        <img class="info_airport-img" :src="`/images/${flightInfo.returnFlight.al}.png`" alt="">
        <p class="info_airport-name ellipsis">{{flightInfo.returnFlight.fn}}</p>
      </div>
      <div class="info_time">
        <div class="info_time-depart">
          <span class="depart_time">{{getHourAndMinute(new Date(flightInfo.returnFlight.dt))}}</span>
          <p class="depart_code">{{flightInfo.returnFlight.ds}}</p>
        </div>
        <div class="info_time-stop">
          <p class="stop_time">{{'2h15m'}}</p>
          <i class="s-icon s-icon-flyto"></i>
          <p class="stop_number" v-if="flightInfo.returnFlight.sb > 0">{{flightInfo.returnFlight.sb > 1?flightInfo.returnFlight.sb+' stops':flightInfo.returnFlight.sb+' stop'}}</p>
        </div>
        <div class="info_time-arrive">
          <span class="return_time">{{getHourAndMinute(new Date(flightInfo.returnFlight.at))}}</span>
          <p class="return_code">{{flightInfo.returnFlight.as}}</p>
        </div>
      </div>
    </div>
    <div class="info_price" v-if="pCount">
      <p class="info_price_save">Save &#8377;{{Math.round(flightInfo.fee.fees[0].dis / pCount) | addCommas}}</p>
      <div class="info_price_bottom">
        <p class="info_price_text">My galaxy user only price</p>
        <div class="info_price_total">
          <p class="info_price_old">&#8377;{{Math.round((flightInfo.fee.fees[0].bfp + flightInfo.fee.fees[0].gst + flightInfo.fee.fees[0].dis)/pCount) | addCommas}}</p>
          <p class="info_price_now">&#8377;{{Math.round((flightInfo.fee.fees[0].bfp + flightInfo.fee.fees[0].gst)/pCount) | addCommas}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getHourAndMinute } from '@/utils/DateFormatUtils.js';
export default {
  props: {
    flightInfo: Object,
    pCount: Number
  },
  data () {
    return {
      getHourAndMinute
    };
  }
};
</script>
<style lang="scss" scoped>
.flight_template{
  background: #fff;
  padding:0.3rem;
  border-radius:0.12rem;
  box-shadow:0rem 0.02rem 0.06rem 0rem rgba(174,174,174,0.5);
  &:active{
    background:#F2F2F2;
  }
}
.flight_info{
  width:6rem;
  margin: auto;
  @include flexCenter;
  justify-content: space-between;
}
.flight_info1{
  margin-bottom: 0.4rem;
}
.flight_info2{
  margin-bottom: 0.2rem;
  padding-bottom: 0.2rem;
  border-bottom:1px dotted #dcdcdc;
}
.info_airport{
  width:15%;
  line-height: 0rem;
}
.info_airport-img{
  display: block;
  width:0.4rem;
  height:0.4rem;
  border-radius:50%;
  margin:0 auto 0.12rem;
}
.info_airport-name{
  font-size:0.2rem;
  font-weight:400;
  color: $lightBlack;
  line-height:0.25rem;
  text-align: center;
  margin:auto;
}
// time
.info_time{
  width:75%;
  @include flexCenter;
  justify-content: space-between;
}
.stop_number{
  font-size:0.2rem;
  color:$lighterBlack;
  line-height:0.22rem;
  text-align: center;
  color:$green;
}
.depart_time, .return_time{
  display: block;
  font-size:0.38rem;
  color:#333;
  line-height:0.47rem;
  text-align: center;
  margin-bottom:5px;
}
.stop_time, .depart_code, .return_code{
  font-size:0.22rem;
  color:$lighterBlack;
  line-height:0.27rem;
  text-align: center;
  font-weight: bold;
}

// price
.info_price{
  text-align: left;
}
.info_price_bottom, .info_price_total{
  @include flexCenter;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: -0.1rem;
}
.info_price_total{
  margin-top: 0;
}
.info_price_text{
  font-size: 0.2rem;
  line-height: 0.25rem;
  color:$lightBlack;
}
.info_price_old{
  font-size:0.22rem;
  color:$lighterBlack;
  line-height:0.27rem;
  text-decoration: line-through;
}
.info_price_now{
  font-size:0.36rem;
  font-weight:700;
  color:#111;
  line-height:0.45rem;
  margin-left: 0.3rem;
}
.info_price_save{
  font-size:0.22rem;
  color:$yellow;
  height:0.3rem;
  line-height:0.3rem;
  display: inline-block;
}

</style>
