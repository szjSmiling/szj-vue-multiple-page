<template>
  <div class="confirm-info" v-if="trip.triplist && trip.triplist.length > 0">
    <div class="confirm-info-detail-box detail_box1 bgColorGray">
      <p class="confirm-info-title clear">Order ID : <span class="info-title">{{orderId}}</span>
        <span class="order_status">{{statusList[status]}}</span>
      </p>
      <p class="confirm-info-title2">Booking Time: {{getHFWDMY(new Date(tripInfo.creatTime))}}</p>
    </div>
    <div class="confirm-info-detail-box2" v-if="trip.triplist && trip.triplist.length > 0">
      <div v-for="(item, key) in trip.triplist" :key="key">
        <p class="confirm-info-detail-title2 text-style clear marBot30">
          {{item.voyageinfo[0].dc}} - {{item.voyageinfo[item.voyageinfo.length - 1].ac}}
        </p>
        <template v-for="(voyage, index) in item.voyageinfo">
          <TripDetailCity class="confirm-info-detail-box" :flag="list[key]" :mark="key" :index="index"
          :tripCity="voyage" :baggageinfo="item.baggageinfo" :key="voyage.status"/>
          <div class="voyage_duration_time text-style marBot30" :key="voyage.status"
            v-if="item.voyageinfo.length > 1 && index !== item.voyageinfo.length -1 " >
            {{getTimeChaHourAndMinute(new Date(item.voyageinfo[index+1].dt).getTime() - new Date(item.voyageinfo[index].at).getTime())}}
          </div>
        </template>
        <template v-for="(travel, index)  in item.travellerinfo" >
          <TripDetailTraveller class="confirm-info-detail-box" :flag="travelList[key]" :mark="key" :index="index"
          :ticketInfo="item.ticketsinfo[0][index]" :tripTraveller="travel" :key="travel.name" />
        </template>
      </div>
    </div>
    <div class="confirm-info-detail-box bgColorGray">
      <TripDetailContact :tripContact="tripInfo" />
      <TripDetailPrice :tripPrice="orderInfo" :tripList="trip" />
    </div>
  </div>
</template>
<script>
import TripDetailCity from './TripDetailCity';
import TripDetailTraveller from './TripDetailTraveller';
import TripDetailContact from './TripDetailContact';
import TripDetailPrice from './TripDetailPrice';
import { mapState } from 'vuex';
import { getHFWDMY, getTimeChaHourAndMinute } from '@/utils/DateFormatUtils';
import EventHub from '@/utils/EventHub';
export default {
  components: {
    TripDetailCity,
    TripDetailTraveller,
    TripDetailContact,
    TripDetailPrice
  },
  data () {
    return {
      getHFWDMY,
      getTimeChaHourAndMinute,
      list: {},
      status: null,
      travelList: {}
    }
  },
  computed: {
    ...mapState({
      orderId: state => state.MyTripList.orderId,
      statusList: state => state.MyTripList.statusList,
      trip: state => state.MyTripList.tripDetailInfo,
      tripInfo: state => state.MyTripList.tripInfo,
      orderInfo: state => state.MyTripList.orderInfo,
      voyageInfo: state => state.MyTripList.voyageInfo,
      travellerinfo: state => state.MyTripList.travellerinfo
    })
  },
  watch: {
    trip (val) {
      if (val) {
        val.triplist.forEach((e, i) => {
          let arr = [];
          let arr1 = [];
          e.voyageinfo.forEach((t, j) => {
            arr.push({ flag: false })
          })
          this.$set(this.list, i, arr);
          e.travellerinfo.forEach((t, j) => {
            arr1.push({ flag: false })
          })
          this.$set(this.travelList, i, arr1);
        })
      }
    }
  },
  created () {
    this.status = this.$route.query.status;
    EventHub.$on('showOrhideMore', (data) => {
      this.list[data.mark][data.index].flag = !this.list[data.mark][data.index].flag;
    });
    EventHub.$on('showOrhideTravel', (data) => {
      this.travelList[data.mark][data.index].flag = !this.travelList[data.mark][data.index].flag;
    });
  },
  beforeDestroy () {
    EventHub.$off('showOrhideMore');
    EventHub.$off('showOrhideTravel');
  }
};
</script>
<style lang="scss" scoped>
.bgColorGray{
  background: #f1f1f1;
}
.confirm-info-detail-box{
  padding: 0 0.3rem;
}
.detail_box1{
  padding-top:0.3rem;
  padding-bottom:0.4rem;
}
.marBot20{
  margin-bottom: 0.2rem;
}
.marBot30{
  margin-bottom: 0.3rem;
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
.confirm-info-detail-title{
  color:$lightBlack;
  font-weight: bold;
}
.confirm-info-detail-title2{
  font-size:0.32rem;
  font-weight: bold;
  color:$green;
  padding:0.21rem 0.3rem;
  background:rgba(1,121,89,0.1);
}
.trip-status{
  float: right;
  height:0.24rem;
  font-size: 0.24rem;
}
.issued{
  color:$green;
}
.issuing{
  color:$yellow;
}
.voyage_duration_time{
  text-align: center;
  &::before,&::after{
    display: inline-block;
    width:1.6rem;
    content: "";
    margin-right: 0.3rem;
    margin-left: 0.3rem;
    vertical-align: middle;
    border-top:1px dashed #dcdcdc;
  }
}
</style>
