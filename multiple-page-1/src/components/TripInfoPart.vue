<template>
  <div class="trip_item" >
    <div class="info_airport">
      <img class="info_airport-img" :src="flightInfo.img" alt="">
      <p class="info_airport-name ellipsis">{{'Air India'}}</p>
      <p class="info_airport-port ellipsis">{{flightInfo.fn}}</p>
    </div>
    <div class="time_box">
      <div class="info_time">
        <div class="info_time-depart">
          <p class="return_code">{{flightInfo.ds}}</p>
          <span class="depart_time">{{getHourAndMinute(new Date())}}</span>
        </div>
        <div class="info_time-stop">
          <i class="s-icon s-icon-flyto"></i>
        </div>
        <div class="info_time-arrive">
          <p class="return_code">{{flightInfo.as}}</p>
          <span class="return_time">{{getHourAndMinute(new Date())}}</span>
        </div>
      </div>
      <div class="info_text">
        <p>Tue, 20 Nov</p>
        <p>1 Adult</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getHourAndMinute } from '@/utils/DateFormatUtils.js';
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
      getHourAndMinute
    };
  }
};
</script>

<style lang="scss" scoped>
.trip_item{
  width:4rem;
  @include flexCenter;
  justify-content: space-between;
}
.info_airport{
  width:20%;
  @include flexCenter;
  flex-direction: column;
  align-items: center;
}
.info_airport-img{
  display: block;
  width:0.6rem;
  height:0.6rem;
  border-radius:50%;
  margin:0 auto 3px;
  border-radius:50%;
  border:1px solid #eee;
}
.info_airport-name{
  font-size:0.2rem;
  font-weight:400;
  color: $lighterBlack;
  line-height:0.25rem;
  text-align: center;
  margin:auto;
  color:#333;
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
}
// time
.time_box{
  width:70%;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
}
.info_time{
  @include flexCenter;
  justify-content: space-between;
  align-items: flex-start;
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
  font-size:0.22rem;
  color:$lighterBlack;
  line-height:0.25rem;
  text-align: center;
}
.depart_code, .return_code{
  font-size:0.38rem;
  color:$black;
  line-height:0.47rem;
  text-align: center;
  margin-bottom:5px;
  font-weight: bold;
}
.info_text{
  display:flex;
  justify-content: space-between;
  height:0.27rem;
  font-size:0.24rem;
  color:rgba(17,17,17,1);
  line-height:0.3rem;
  margin-top: 0.2rem;
}
</style>
