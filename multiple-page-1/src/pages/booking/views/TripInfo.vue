<template>
  <div >
    <div class="trip-info" v-for="(item, index) in flightInfo" :key="index">
      <p class="trip-info-title">{{index == 0 ? 'Going' : 'Returning'}}</p>
      <div class="trip-info-detail">
        <p class="trip-info-detail-title">{{item.dc}} ({{item.ds}}) - {{item.ac}} ({{item.as}})</p>
        <ul>
          <li class="trip-info-detail-item">
            <div class="s-trip-general s-trip-general-key">Operated by:</div>
            <div class="s-trip-general s-trip-general-val"> {{item.co}}</div>
          </li>
          <li class="trip-info-detail-item">
            <div class="s-trip-general s-trip-general-key">Departure : </div>
            <div class="s-trip-general s-trip-general-val">{{flightDate(item.dt)}} {{item.da}} ({{item.ds}})</div>
          </li>
          <li class="trip-info-detail-item">
            <div class="s-trip-general s-trip-general-key">Arrival:</div>
            <div class="s-trip-general s-trip-general-val">{{flightDate(item.at)}} {{item.aa}} ({{item.as}})</div>
          </li>
          <li class="trip-info-detail-item">
            <div class="s-trip-general s-trip-general-key">Flight Duration:</div>
            <div class="s-trip-general s-trip-general-val">{{item.wdt}}, {{item.sb == 0 ? 'non': item.sb}}-stop</div>
          </li>
          <li class="trip-info-detail-item">
            <div class="s-trip-general s-trip-general-key">Baggage policy: </div>
            <div class="s-trip-general s-trip-general-val">1 checkin baggage(&lt;{{item.baggageInfo.ch}}kg), 1 Cabin Baggage(&lt;{{item.baggageInfo.ca}}kg)</div>
          </li>
        </ul>
      </div>
      <p class="trip-info-refundable">{{item.fee.refundable ? 'refundable' : 'none-refundable'}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['flightInfo'],
  data () {
    return {

    }
  },
  created () {

  },

  computed: {

  },
  methods: {
    flightDate (fDate) {
      let flightDate = new Date(fDate).toString();
      return flightDate.slice(16, 21) + ' ' + flightDate.slice(0, 3) + ', ' + flightDate.slice(4, 11) + ', ' + flightDate.slice(11, 16)
    },
  },
}
</script>

<style lang="scss" scoped>
  .s-trip-general{
    line-height:0.36rem;
    font-size:$h6;
  }
  .s-trip-general-key{
    width: 30%;
    color:rgba(153,153,153,1);
  }
  .s-trip-general-val{
    width: 70%;
    color:rgba(17,17,17,1);
  }
  .trip-info-title{
    font-size: $h6;
    line-height: 30px;
    color: #666;
    font-weight: 700;
  }
  .trip-info-detail-title{
    font-size:$h3;
    color:rgba(0,0,0,1);
    line-height:0.39rem;
    margin-bottom: 0.21rem;
  }
  .trip-info-detail-item{
    display: flex;
    margin-bottom: 0.1rem;
  }
  .trip-info-refundable{
    font-size: $h6;
    color:rgba(227,164,40,1);
    line-height:0.3rem;
    margin-bottom: 0.1rem;
  }
</style>
