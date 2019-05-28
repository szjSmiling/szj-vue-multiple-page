<template>
  <div class="trip_trip" :class="{'deleteHeight':triplist.length >= 1}">
    <div class="trip_list"
      v-if="triplist.length >= 1"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isMoreLoading"
      :infinite-scroll-immediate-check="true"
      infinite-scroll-distance="60">
      <template v-for="(item, index) in triplist">
        <div class="list_child" :class="{'list_last-child':index === triplist.length -1}" :key="index">
          <p class="list_order_id" @click="searchTripDetail(item)">OrderId: {{item.orderId}}</p>
          <div v-for="(item2, index2) in item.channelTripList" :key="index2" @click="searchTripDetail(item)">
            <TripInfoPart class="info_detail" :flightInfo="item2"></TripInfoPart>
          </div>
          <div v-if="status === 2">
            <p class="passenger_number_seat clear">
              {{item.psrNum > 1?item.psrNum+'travelers':item.psrNum+'traveler'}}, {{item.cabinClass}}
              <span>&#8377;{{item.payAmount | addCommas}}</span>
            </p>
            <a :href="`payment/${item.orderId}/${item.contactMob}`"><button class="list_pay_btn" >Pay Now</button></a>
            <button class="list_cancel_btn" @click="cancelNow(item)">Cancel</button>
          </div>
        </div>
      </template>
      <div class="loading-box" v-show="isLoading">
        <mt-spinner type="fading-circle" :size='30'></mt-spinner>
        <span class="loading-more-txt">loading ...</span>
      </div>
    </div>
    <div class="trip_no_data" v-if="noDataShow">
      <img class="no_data-img" :src="require('../images/no-data.png')" alt="">
      <p class="no_data-text">No {{status ===2 ? 'Unpaid' : Tstatus[status]}} order</p>
      <a class="no_data-btn" href="/">Plan Your Next Journey</a>
    </div>
    <UseAnotherNumber :class="{'noDate_another-account': triplist && triplist.length < 1}" :phoneOrEmail="account" />
  </div>
</template>
<script>
import { Indicator, Spinner } from 'mint-ui';
import { mapState } from 'vuex';
import EventHub from '@/utils/EventHub';
export default {
  components: {
    'mt-spinner': Spinner,
    TripInfoPart: () => import('@/components/TripInfoPartNew'),
    UseAnotherNumber: () => import('@/components/UseAnotherNumber')
  },
  computed: {
    ...mapState({
      status: state => state.MyTripList.status,
      Tstatus: state => state.MyTripList.statusList,
      // triplist: state => state.MyTripList.triplistArray,
      pageNum: state => state.MyTripList.pageNum,
      pageSize: state => state.MyTripList.pageSize,
      totalPage: state => state.MyTripList.totalPage,
      isLoading: state => state.MyTripList.isLoading,
      isMoreLoading: state => state.MyTripList.isMoreLoading,
      noDataShow: state => state.MyTripList.noDataShow,
      account: state => state.MyTripList.userPhoneOrEmail
    }),
    triplist () {
      let arr = this.$store.state.MyTripList.triplistArray;
      arr.forEach(item => {
        let info1 = item.channelTripList[0];
        let info2 = item.channelTripList[1];
        if (item.channelTripList.length > 1) {
          if (item.channelTripList[0].sequence === 2) {
            item.channelTripList[0] = info2;
            item.channelTripList[1] = info1;
          }
        }
      })
      return arr;
    }
  },
  created () {
    Indicator.open({
      text: 'loading...',
      spinnerType: 'fading-circle'
    });
    this.$store.dispatch('selectDiffStatus', 1);
  },
  methods: {
    loadMore () {
      if (this.pageNum >= this.totalPage) {
        this.$store.dispatch('changeLoadMoreAction', false);
        return false;
      } else {
        this.$store.dispatch('changeLoadMoreAction', true);
      }
    },
    searchTripDetail (info) {
      this.$router.push(`/trip/detail?tripId=${info.orderId}&status=${this.status}`);
    },
    cancelNow (who) {
      EventHub.$emit('showCncelModel', who.orderId);
    }
  }
};
</script>
<style lang="scss">
.trip_list .mint-spinner-fading-circle{
  margin:auto;
}
</style>
<style lang="scss" scoped>
.trip_trip{
  height:100%;
  position: relative;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  background: #f1f1f1;
}
.deleteHeight{
  // height:calc(100% - 0.84rem);
  height: 100%;
  padding-bottom: 0.58rem;
}
.trip_list{
  background: rgb(241,241,241);
  overflow: hidden;
  padding:0.3rem;
  margin-top: 0.84rem;
}
.info_detail{
  margin-bottom: 0.3rem;
}
.info_detail2{
  margin-bottom: 0.38rem;
}
.passenger_number_seat{
  color:$lightBlack;
  font-size: 0.24rem;
  line-height:0.3rem;
  margin-bottom: 0.3rem;
  span{
    float: right;
    color:#111;
    font-weight: bold;
    font-size: 0.36rem;
  }
}
.list_order_id{
  color:$lighterBlack;
  font-size: 0.2rem;
  line-height:0.25rem;
  margin-bottom: 0.2rem;
}
.list_child{
  background: #fff;
  padding:0.3rem;
  margin-bottom: 0.2rem;
  border-radius:0.12rem;
  box-shadow:0rem 0.02rem 0.06rem 0rem rgba(174,174,174,0.5);
  &:active{
    background:#F2F2F2;
  }
}
.list_last-child{
  margin-bottom: 0;
}
.list_pay_btn{
  display: block;
  width:5.4rem;
  height:0.68rem;
  line-height: 0.68rem;
  color:#fff;
  font-size: 0.28rem;
  background:$yellow;
  border-radius:0.04rem;
  font-weight: bold;
  margin: 0 auto 0.2rem;
}
.list_cancel_btn{
  display:block;
  height:0.27rem;
  font-size: 0.24rem;
  line-height: 0.3rem;
  color:$lighterBlack;
  margin:auto;
  background: transparent;
}
// no data
.trip_no_data{
  width:5rem;
  background:#f1f1f1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align:center;
}
.no_data-img{
  width:1.8rem;
}
.no_data-text{
  height:0.42rem;
  line-height:0.42rem;
  color:$lighterBlack;
  font-size: 0.28rem;
  margin:0.3rem 0 0.6rem;
  letter-spacing:0.5px;
}
.no_data-btn{
  display:block;
  width:4.8rem;
  height:0.68rem;
  line-height:0.68rem;
  color:#fff;
  font-size: 0.28rem;
  font-weight: bold;
  background: $yellow;
  border-radius:0.12rem;
  margin:auto;
  &:active{
    background:#CB9323;
  }
}
// loading...
.loading-box {
  text-align: center;
}
.loading-more-txt {
  font-size: 0.18rem;
}

// switch account
.noDate_another-account{
  position: fixed;
  bottom: 1.3rem;
  left: 50%;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
}
</style>
