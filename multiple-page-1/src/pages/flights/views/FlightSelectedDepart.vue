<template>
  <div class="depart" @click="quitSelected">
    <div class="depart-box">
      <div class="depart-city">
        Going: {{flightItem.ds}} - {{flightItem.as}}
      </div>
      <div class="depart-change">Change</div>
    </div>
    <div class="depart-box">
      <div class="depart-time">
        {{flightItem.dt.slice(-5)}} - {{flightItem.at.slice(-5)}} &nbsp;&nbsp; {{flightItem.co}} {{flightItem.fn}}
      </div>
      <div class="depart-price">&#8377; {{flightItem.opr | addCommas}}</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      flightItem: (state) => state.FlightInfo.selectedFlights[0],
    }),
    // flightItem () {
    //   const id = parseInt(this.$route.query.departid);
    //   return this.flightsData.departFlightArray.filter(v => v.id === id)[0]
    // }
  },
  methods: {
    quitSelected () {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.depart{
  width:6.6rem;
  height:1.21rem;
  background:rgba(1,121,89,.1);
  box-shadow:0rem 0.02rem 0.06rem 0rem rgba(174,174,174,0.5);
  border-radius:0.12rem;
  margin: 0 auto 0.2rem;
  padding: 0.2rem;
  &:active{
    background:rgba(1,121,89,.2);
  }
}
.depart-box{
  display: flex;
  justify-content: space-between;
  & + .depart-box{
    margin-top: 0.15rem;
  }
}
.depart-city{
  font-weight: bold;
  font-size: 0.28rem;
}
.depart-change{
  color: $green;
  font-size: 0.24rem;
  font-weight: bold;
}
.depart-time, .depart-price{
  color: $black;
  font-size: 0.22rem;
}
</style>
