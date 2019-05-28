<template>
  <div class="detail_city" v-if="flag">
    <div class="confirm-info-detail" >
      <p class="text-style detail_fn marBot20">{{tripCity.fn}}, operated by {{tripCity.an}}</p>
      <div class="confirm-info-detail-title marBot30">
        <div>
          <p class="detail-depart_port marBot20">{{tripCity.da+' ('+tripCity.ds+')'}}</p>
          <p class="detail-depart_time text-style">{{getHFWDMY(new Date(tripCity.dt))}}</p>
        </div>
        <i class="s-icon s-icon-rightarrow"></i>
        <div >
          <p class="detail-return_port marBot20 right">{{tripCity.aa+' ('+tripCity.as+')'}}</p>
          <p class="detail-return_time text-style right">{{getHFWDMY(new Date(tripCity.at))}}</p>
        </div>
      </div>
      <div class="show_more_detail marBot30">
        <button @click="showMoreDetail">More Info
          <i class="s-icon" :class="flag[index].flag?'s-icon-up':'s-icon-down'"></i>
        </button>
      </div>
      <VerticalToggle>
        <ul class="detail_ul_li" v-show="flag[index].flag">
          <li class="confirm-info-detail-item">
            <div class="text-style s-confirm-general-key">Flight Duration: </div>
            <div class="text-style s-confirm-general-val">{{tripCity.wdt}}</div>
          </li>
          <li class="confirm-info-detail-item">
            <div class="text-style s-confirm-general-key">Cabin Class:</div>
            <div class="text-style s-confirm-general-val">{{orderInfo.cabinClass}}</div>
          </li>
          <li class="confirm-info-detail-item">
            <div class="text-style s-confirm-general-key">Baggage Policy:</div>
            <div class="text-style s-confirm-general-val">
              1 checkin luggage ( &lt; {{baggageinfo[tripCity.fn].ch}}kg ), 1 cabin luggage ( &lt; {{baggageinfo[tripCity.fn].ca}} kg )
            </div>
          </li>
          <li class="confirm-info-refundable" >
            {{tripCity.refundable?'refundable':'none-refundable'}}
          </li>
        </ul>
      </VerticalToggle>
    </div>
  </div>
</template>
<script>
import { getHFWDMY } from '@/utils/DateFormatUtils';
import EventHub from '@/utils/EventHub';

export default {
  props: ['tripCity', 'baggageinfo', 'flag', 'mark', 'index'],
  components: {
    VerticalToggle: () => import('@/utils/vertical-toggle.js')
  },
  data () {
    return {
      getHFWDMY
    }
  },
  computed: {
    orderInfo () {
      return this.$store.state.MyTripList.orderInfo
    }
  },
  methods: {
    showMoreDetail () {
      EventHub.$emit('showOrhideMore', { mark: this.mark, index: this.index });
    }
  }
}
</script>
<style lang="scss" scoped>
.left{text-align: left;}
.right{text-align: right;}
.marBot20{
  margin-bottom: 0.2rem;
}
.marBot30{
  margin-bottom: 0.3rem;
}
.marTopBom{
  margin-bottom: 0.3rem;
  margin-top: 0.4rem;
}
.text-style{
  font-size: 0.24rem;
  line-height: 0.3rem;
}
.confirm-info-title{
  font-size: 0.24rem;
  line-height: 0.48rem;
  color: $lighterBlack;
}
.confirm-info-title2{
  font-size: 0.24rem;
  color: $lighterBlack;
}
.order_status{
  float: right;
  width:2.2rem;
  height:0.48rem;
  color:#fff;
  text-align: center;
  border-radius:0.24rem;
  background: $lighterBlack;
}
.info-title{
  color: $lightBlack;
}
.detail_fn{
  color:$lightBlack;
  font-weight: bold;
  letter-spacing: 0.5px;
}
.confirm-info-detail-title{
  @include flexCenter;
  justify-content: space-between;
}
.detail-depart_port,.detail-return_port{
  width:3rem;
  height: 0.8rem;
  color:#111;
  font-weight: bold;
  font-size:0.28rem;
  line-height:0.42rem;
  // display: -webkit-box;
  // -webkit-box-orient: vertical;
  // -webkit-line-clamp: 2;
  overflow:hidden;
  // white-space:nowrap;
  // text-overflow: ellipsis;
}
.detail-depart_time,.detail-return_time{
  color:#333;
}
.show_more_detail{
  @include flexCenter;
  justify-content: flex-end;
  button{
    color:$green;
    background: transparent;
  }
  .s-icon-down,.s-icon-up{
    margin-left: 0.1rem;
  }
}
.confirm-info-detail-title2{
  font-size:0.32rem;
  line-height:0.39rem;
  color:rgba(0,0,0,1);
  font-weight: bold;
}
.trip-status{
  float: right;
  height:0.27rem;
  color:#333;
  font-size: 0.24rem;
}
.issued{
  color:$green;
}
.issuing{
  color:$yellow;
}
.confirm-info-detail-item{
  display: flex;
  margin-bottom: 0.1rem;
}
.confirm-info-detail-item-price{
  margin-top: 0.38rem;
}
.confirm-info-refundable{
  font-size: 0.24rem;
  color:rgba(227,164,40,1);
  line-height:0.3rem;
}
.confirm-info-refundable{
  font-size: 0.24rem;
  color:rgba(227,164,40,1);
  line-height:0.3rem;
}
.s-confirm-general-key{
  width: 30%;
  color:rgba(153,153,153,1);
}
.s-confirm-general-val{
  width: 70%;
  color:rgba(17,17,17,1);
}
.detail_ul_li{
  li:last-child{
    margin-bottom: 0.2rem;
  }
}
</style>
