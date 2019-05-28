<template>
  <div>
    <h3 class="text-style info_title_time">{{getWDMY(new Date(flightInfo.departDate))}}</h3>
    <div class="trip_item" >
      <div class="info_airport">
        <div class="info_airport_box">
          <img class="info_airport-img"
            :class="{'marginAuto':!flightInfo.channelAirlineList || DeleteArrayRepeat(flightInfo.channelAirlineList, 'airCompanyId').length <= 1}"
            :src="`/images/${flightInfo.channelAirlineList[0].airCompanyId}.png`" alt="">
          <div class="info_airport-img2"
            v-if="flightInfo.channelAirlineList && DeleteArrayRepeat(flightInfo.channelAirlineList, 'airCompanyId').length > 1" >
            ...
          </div>
        </div>
        <p class="info_airport-port ellipsis">
          {{flightInfo.channelAirlineList | isMoreCompay}}
        </p>
      </div>
      <div class="time_box">
        <div class="info_time">
          <div class="info_time-depart">
            <span class="return_code">{{flightInfo.departCity}}</span>
            <span class="depart_time">{{getHourAndMinute(new Date(flightInfo.departDate))}}</span>
          </div>
          <div class="info_time-stop">
            <i class="s-icon s-icon-flyto"></i>
          </div>
          <div class="info_time-arrive">
            <span class="return_code">{{flightInfo.arriveCity}}</span>
            <span class="return_time">{{getHourAndMinute(new Date(flightInfo.arriveDate))}}</span>
            <span class="return_time" v-if="Number(flightInfo.addDay) >= 1">+{{flightInfo.addDay}}</span>
          </div>
        </div>
        <div class="info_text">
          <span class="text-style text_flying_number">{{flightInfo.channelAirlineList[0].flightNo}}</span>
          <span class="text-style text_flying_last_on">
            {{getTimeChaHourAndMinute(new Date(flightInfo.arriveDate).getTime() - new Date(flightInfo.departDate).getTime(), 2)}}
          </span>
          <span class="text-style text_flying_stop">{{flightInfo.channelAirlineList | computedStop}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getHourAndMinute, getTimeChaHourAndMinute, getWDMY } from '@/utils/DateFormatUtils.js';
import { DeleteArrayRepeat } from '@/utils/DeleteArrayRepeat';
export default {
  props: {
    flightInfo: {
      type: Object,
      default: function () {
        return {
          ds: 'del',
          as: 'Bom'
        }
      }
    }
  },
  data () {
    return {
      DeleteArrayRepeat,
      getHourAndMinute,
      getTimeChaHourAndMinute,
      getWDMY
    };
  },
  filters: {
    isMoreCompay (val) {
      val = DeleteArrayRepeat(val, 'airCompanyId');
      let airCompanyId = val.length > 1 ? 'Multiple' : val[0].airCompanyId;
      return airCompanyId;
    },
    computedStop (val) {
      if (val.length > 2) {
        return `, ${val.length - 1} stops`;
      } else if (val.length === 2) {
        return `, 1 stop`;
      } else {
        return '';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.text-style{
  height:0.27rem;
  color:#333;
  font-size:0.24rem;
  line-height:0.3rem;
}
.info_title_time{
  font-weight: 700;
  margin-bottom: 0.23rem;
}
.trip_item{
  height:0.9rem;
  @include flexCenter;
  justify-content: flex-start;
  align-items: flex-start;
}
.info_airport{
  width:0.9rem;
  @include flexCenter;
  flex-direction: column;
  align-items: center;
}
.info_airport_box{
  width:0.9rem;
  position: relative;
  img{
    width:0.59rem;
    height:0.59rem;
    margin:auto;
    border-radius:50%;
    border:1px solid #eee;
    border-radius:50%;
  }
  div{
    width:0.59rem;
    height:0.59rem;
    border-radius:50%;
    border:1px solid #eee;
    border-radius:50%;
  }
}
.info_airport-img{
  position: relative;
  z-index: 2;
  top: 0;
  left: 0;
  background: #fff;
}
.marginAuto{
  display: block;
}
.info_airport-img2{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  color:#999;
  text-align: right;
  background: #eaeaea;
}
.info_airport-port{
  color:$lighterBlack;
  font-size: 0.2rem;
  line-height: 0.3rem;
  margin-top: 3px;
}
.info_time-stop{
  color:#333;
  line-height: 0.47rem;
  margin:0 0.2rem;
}
// time
.time_box{
  flex:1;
  margin-left: 0.3rem;
}
.info_time{
  @include flexCenter;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 0.35rem;
}
.stop_number{
  font-size:0.2rem;
  color:$lighterBlack;
  line-height:0.22rem;
  text-align: center;
  color:$green;
}
.info_time-depart, .info_time-stop,.info_time-arrive{
  @include flexCenter;
  align-items: flex-end;
}
.depart_time, .return_time{
  display: block;
  font-size:0.22rem;
  color:$lighterBlack;
  line-height:0.25rem;
  text-align: center;
}
.depart_code, .return_code{
  font-size:0.36rem;
  color:$black;
  line-height: 0.3rem;
  text-align: center;
  font-weight: bold;
  margin-right: 0.1rem;
}
.text_flying_last_on{
  padding-left:0.1rem;
  border-left:1px solid #ddd;
}
.text_flying_number{
  margin-right: 0.1rem;
}
</style>
