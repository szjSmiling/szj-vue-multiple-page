<template>
  <div class="detail_manage">
    <p class="confirm-info-detail-title text-style">Manage Trip</p>
    <ul>
      <li class="confirm-info-detail-manage" v-if="tripData.triplist.length > 1 && (tripData.triplist[0].isChangeable || tripData.triplist[1].isChangeable)" @click="cancelTrip">
        <div class="text-style2 " >Cancel Trip</div>
        <i class="s-icon s-icon-datadown"></i>
      </li>
      <li class="confirm-info-detail-manage" v-if="tripData.triplist.length <= 1 && tripData.triplist[0].isChangeable" @click="cancelTrip">
        <div class="text-style2 " >Cancel Trip</div>
        <i class="s-icon s-icon-datadown"></i>
      </li>
      <li class="confirm-info-detail-manage" v-if="tripData.triplist.length > 1 && (tripData.triplist[0].isChangeable || tripData.triplist[1].isChangeable)" @click="changeTrip">
        <div class="text-style2 " >Change Trip</div>
        <i class="s-icon s-icon-datadown"></i>
      </li>
      <li class="confirm-info-detail-manage" v-if="tripData.triplist.length <= 1 && tripData.triplist[0].isChangeable" @click="changeTrip">
        <div class="text-style2 " >Change Trip</div>
        <i class="s-icon s-icon-datadown"></i>
      </li>
      <li class="confirm-info-detail-manage" v-if="status === 1 && tripData.triplist.length > 1 && tripData.triplist[0].isTicketNo && tripData.triplist[1].isTicketNo">
        <a class="manage_a_print" :href="'/heg_api/itinerary/printInvoice.do?tripId='+tripId+'&mob='+mobile">
          <div class="text-style2" >Print Invoice</div>
          <i class="s-icon s-icon-datadown"></i>
        </a>
      </li>
      <li class="confirm-info-detail-manage" v-if="status === 1 && tripData.triplist.length <= 1 && tripData.triplist[0].isTicketNo">
        <a class="manage_a_print" :href="'/heg_api/itinerary/printInvoice.do?tripId='+tripId+'&mob='+mobile">
          <div class="text-style2" >Print Invoice</div>
          <i class="s-icon s-icon-datadown"></i>
        </a>
      </li>
      <li class="confirm-info-detail-manage">
        <a class="manage_a_print" :href="'/heg_api/itinerary/printItinerary.do?tripId='+tripId">
          <div class="text-style2" >Print Ticket</div>
          <i class="s-icon s-icon-datadown"></i>
        </a>
      </li>
      <li class="confirm-info-detail-manage" @click="shareTrip">
        <div class="text-style2" >Share Trip</div>
        <i class="s-icon s-icon-datadown"></i>
      </li>
    </ul>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { mapState } from 'vuex';
export default {
  props: ['tripManage'],
  data () {
    return {
      canChange: false
    }
  },
  computed: {
    ...mapState({
      status: state => state.MyTripList.status,
      tripId: state => state.MyTripList.tripInfo.id,
      tripData: state => state.MyTripList.tripDetailInfo,
      mobile: state => state.MyTripList.tripInfo.contactMob
    })
  },
  methods: {
    shareTrip () {
      this.$http(`/heg_api/itinerary/sendTicketAttach.do?tripId=${this.tripId}`).then(res => {
        if (res.success) {
          Toast('Itinerary sent via email. Kindly check your inbox or spam folder.');
        } else {
          Toast(res.msg);
        }
      });
    },
    changeTrip () {
      this.$router.push(`/trip/changetrip/${this.tripId}`);
    },
    cancelTrip () {
      this.$router.push(`/trip/canceltrip/${this.tripId}`);
    }
  }
}
</script>
<style lang="scss" scoped>
.detail_manage{
  padding-bottom: 0.3rem;
}
.marTopBom{
  margin-bottom: 0.3rem;
  margin-top: 0.4rem;
}
.text-style2{
  color:#111;
  font-size: 0.28rem;
  line-height: 0.35rem;
}
.confirm-info-detail-title{
  color:$lightBlack;
  font-weight: bold;
}
.s-confirm-general-key{
  width: 30%;
  color:rgba(153,153,153,1);
}
.s-confirm-general-val{
  width: 70%;
  color:rgba(17,17,17,1);
}
// manage
.confirm-info-detail-manage{
  padding:0.28rem 0;
  border-bottom:1px solid #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.confirm-info-detail-manage:last-child {
  border:0;
}
.manage_a_print{
  width:100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.s-icon-datadown{
  cursor: pointer;
  transform: rotate(-90deg);
}
</style>
