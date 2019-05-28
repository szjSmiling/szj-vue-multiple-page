<template>
  <div class="flight_template">
    <div class="flight_info">
      <div class="info_airport">
        <img class="info_airport-img" :src="`/images/${flightInfo.al}.png`" alt="">
        <p class="info_airport-name ellipsis">{{flightInfo.fn}}</p>
      </div>
      <div class="info_time">
        <div class="info_time-depart">
          <span class="depart_time">{{getHourAndMinute(new Date(flightInfo.dt))}}</span>
          <p class="depart_code">{{flightInfo.ds}}</p>
        </div>
        <div class="info_time-stop">
          <p class="stop_time">{{flightInfo.wdt}}</p>
          <i class="s-icon s-icon-flyto"></i>
          <p class="stop_number" v-if="flightInfo.sb > 0">
            {{`${flightInfo.sb}stop${flightInfo.sb>1 ? 's': ''}`}}</p>
        </div>
        <div class="info_time-arrive">
          <span class="return_time">{{getHourAndMinute(new Date(flightInfo.at))}}</span>
          <p class="return_code">{{flightInfo.as}}</p>
        </div>
      </div>
      <div class="info_price">
        <p class="info_price_old">
          &#8377;{{Math.round((flightInfo.fee.fees[0].bfp + flightInfo.fee.fees[0].gst + flightInfo.fee.fees[0].dis)/flightInfo.fee.pCount) | addCommas}}
        </p>
        <p class="info_price_now">&#8377;{{Math.round((flightInfo.fee.fees[0].bfp + flightInfo.fee.fees[0].gst)/flightInfo.fee.pCount) | addCommas}}
        </p>
        <p class="info_price_save">Save &#8377;{{Math.round((flightInfo.fee.fees[0].dis)/flightInfo.fee.pCount)| addCommas}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getHourAndMinute } from '@/utils/DateFormatUtils.js';
export default {
  props: {
    flightInfo: {
      type: Object
    }
  },
  data () {
    return {
      getHourAndMinute
    };
  }
};
</script>
<style lang="scss" scoped>
.flight_info{
  width:6.6rem;
  margin: auto;
  // height:1.53rem;
  background: #fff;
  padding:0.3rem 0.2rem;
  border-radius:0.12rem;
  box-shadow:0rem 0.02rem 0.06rem 0rem rgba(174,174,174,0.5);
  @include flexCenter;
  &:active{
    background:#F2F2F2;
  }
}
.info_airport{
  width:15%;
  line-height: 0rem;
}
.info_airport-img{
  display: block;
  width:0.4rem;
  height:0.4rem;
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
  width:60%;
  @include flexCenter;
  justify-content: space-around;
  border-right:0.01rem dashed rgba(220,220,220,1);
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
  color:$black;
  line-height:0.47rem;
  text-align: center;
  margin-bottom:5px;
}
.stop_time, .depart_code, .return_code{
  font-size:0.22rem;
  color:$lighterBlack;
  line-height:0.27rem;
  text-align: center;
}

// price
.info_price{
  width:25%;
  text-align: right;
}
.info_price_old{
  font-size:0.22rem;
  color:$lighterBlack;
  line-height:0.27rem;
  text-decoration: line-through;
}
.info_price_old .icon-inr{
  // margin-right:3px;
  color:$lighterBlack;
  font-size: 11px;
}
.info_price_now{
  font-size:0.36rem;
  font-weight:700;
  color:#111;
  line-height:0.45rem;
}
.info_price_now .icon-inr{
  color:#111;
  font-weight:700;
  // margin-right:3px;
  font-size: 18px;
}
.info_price_save{
  font-size:0.22rem;
  color:$yellow;
  line-height:0.3rem;
  display: inline-block;
}
.info_price_save .icon-inr{
  color:$yellow;
  // margin-right:3px;
  font-size: 11px;
}

</style>
