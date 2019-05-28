<template>
  <div class="detail_price" v-if="tripPrice.fee">
    <div class="confirm-info-detail">
      <p class="confirm-info-detail-title text-style">Pricing Detail</p>
      <!-- <p class="text-style2" v-if="isShowOtherTrip">Note: This trip is booked with trip <a class="green line_under" @click="switchOtherTripInfo">{{tripId}}</a></p>
      <p class="text-style2" v-if="isShowOtherTrip">Pricing detail below contains both trip.</p> -->
    </div>
    <ul>
      <li class="confirm-info-detail-item-price">
        <div class="text-style s-confirm-general-key">Base fare</div>
        <div class="text-style s-confirm-general-val">&#8377; {{tripPrice.fee.bf | addCommas}}</div>
      </li>
      <li class=" confirm-info-detail-item-price">
        <div class="text-style s-confirm-general-key">Taxes &amp; Fees</div>
        <div class="text-style s-confirm-general-val">&#8377; {{tripPrice.fee.gst | addCommas}}</div>
      </li>
      <li class=" confirm-info-detail-item-price">
        <div class="text-style s-confirm-general-key">Convenience Fee</div>
        <div class="text-style s-confirm-general-val">&#8377; {{tripPrice.fee.cf | addCommas}}</div>
      </li>
      <li class=" confirm-info-detail-item-price">
        <div class="text-style s-confirm-general-key">Customer Prom</div>
        <div class="text-style s-confirm-general-val green">
          <span v-if="Math.abs(tripPrice.fee.dist) > 0">-</span>
          &#8377; {{Math.abs(tripPrice.fee.dist) | addCommas}}</div>
      </li>
      <li class=" confirm-info-detail-item-price">
        <div class="text-style s-confirm-general-key">Insurance</div>
        <div class="text-style s-confirm-general-val ">&#8377; {{tripPrice.fee.insp | addCommas}}</div>
      </li>
      <li class=" confirm-info-detail-item-price space-line">
        <div class="text-style s-confirm-general-key">Grand Total</div>
        <div class="text-style s-confirm-general-val ">&#8377; {{tripPrice.fee.gt | addCommas}}</div>
      </li>
      <li class=" confirm-info-detail-item-price">
        <div class="text-style s-confirm-general-key">Coupon</div>
        <div class="text-style s-confirm-general-val green">
          <span v-if="Math.abs(tripPrice.fee.cn) > 0">-</span>
          &#8377; {{Math.abs(tripPrice.fee.cn) | addCommas}}</div>
      </li>
    </ul>
    <div class=" confirm-info-detail-item-price confirm-info-detail-total">
      <div class="text-style s-confirm-general-total-key">Total</div>
      <div class="text-style s-confirm-general-total-val">
        &#8377;{{tripPrice.fee.pp | addCommas}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['tripPrice', 'tripList'],
  data () {
    return {
      tripId: null,
      tripIdList: [],
      isShowOtherTrip: false
    }
  },
  watch: {
    tripList (val) {
      if (val.triplist.length >= 2) {
        this.isShowOtherTrip = true;
      }
      if (val) {
        this.tripIdList = val.triplist.map(id => ({ id: id }));
        val.triplist.forEach(e => {
          if (e.id !== this.$route.query.tripId) {
            this.tripId = e.id;
          }
        })
      }
    }
  },
  // methods: {
  //   switchOtherTripInfo () {
  //     this.$store.commit('saveSearchDetailInfo', this.tripId);
  //     this.$router.push(`/trip/detail?tripId=${this.tripId}&status=1`);
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.text-style{
  font-size: 0.24rem;
  line-height: 0.3rem;
}
.text-style2{
  font-size: 0.24rem;
  line-height: 0.36rem;
}
.detail_price{
  padding-bottom: 0.3rem;
}
.confirm-info-detail-title{
  color:$lightBlack;
  font-weight: bold;
  margin-bottom: 0.3rem;
  font-size: 0.32rem;
  line-height: 0.39rem;
}
.confirm-info-detail-item-price{
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
}
.s-confirm-general-key{
  width: 30%;
  color:rgba(153,153,153,1);
}
.s-confirm-general-val{
  width: 70%;
  color:rgba(17,17,17,1);
  text-align: right;
  font-size: 0.32rem;
  line-height: 0.45rem;
}
.space-line{
  padding-top: 0.45rem;
  border-top:0.01rem solid rgba(220,220,220,1);
}
// total
.confirm-info-detail-total{
  justify-content: flex-end;
  align-items: flex-end;
}
.s-confirm-general-total-key{
  color:$lighterBlack;
  font-size: 0.24rem;
  line-height: 0.3rem;
}
.s-confirm-general-total-val{
  font-size: 0.42rem;
  line-height: 0.52rem;
  font-weight: bold;
  margin-left: 0.2rem;
}
.green{
  color:$green;
}
.line_under{
  text-decoration:underline;
}
</style>
