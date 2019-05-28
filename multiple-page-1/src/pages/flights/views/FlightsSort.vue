<template>
  <div class="flight_sort__wrap">
    <FlightSelectedDepart v-if="showWhichFlights === 1"/>
    <div class="flights_sort">
      <div class="flights_filter">
        <h3 class="flights_filter-select noselect">{{showWhichFlightsString}}</h3>
        <p class="flights_filter-text noselect" @click="showFilterModel">Filter <i class="flights_filter-icon s-icon s-icon-filter"></i></p>
      </div>
      <ul class="flights_sort_type">
        <li class="sort_type-li" v-for="item in sortTypes" :key="item.id" @click="changeSortType(item.id)">
          <span class="sort_type-child noselect" :class="{'sort_type-child-active': item.id === sortType}">{{item.name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import FlightSelectedDepart from '../views/FlightSelectedDepart';
import { Indicator } from 'mint-ui';

export default {
  components: {
    FlightSelectedDepart
  },
  data () {
    return {
      sortTypes: [
        { id: 0, name: 'Best Price' },
        { id: 1, name: 'Shortest Time' },
        { id: 2, name: 'Departure Time' }
      ]
    };
  },
  computed: {
    ...mapState({
      showWhichFlights: (state) => state.FlightInfo.showWhichFlights,
      tripType: state => state.SearchForm.tripType,
      sortType: (state) => state.FlightInfo.sortType,
    }),
    // 航班列表数据
    ...mapGetters(['flightsDataList']),
    isInternational () {
      return this.$store.getters.isInternational;
    },
    showWhichFlightsString () {
      if (this.tripType === 0) {
        return 'Select Flight';
      } else {
        if (this.isInternational) {
          return 'Select Flight Combination';
        } else {
          return this.showWhichFlights === 0 ? 'Select Going Flight' : 'Select Returnning Flight';
        }
      }
    }
  },
  methods: {
    showFilterModel () {
      // 有数据才能点筛选
      this.flightsDataList && this.flightsDataList.length !== 0 && this.$router.push({ path: `/flights/${this.$route.params.citys}/${this.$route.params.date}/flights-filter`, query: this.$route.query });
    },
    changeSortType (id) {
      this.$store.commit('CHANGE_FLIGHT_SORT', id);
      Indicator.open({
        spinnerType: 'fading-circle',
      });
      setTimeout(() => {
        Indicator.close();
      }, 600);
    }
  }
};
</script>
<style lang="scss" scoped>
.flight_sort__wrap{
  background-color: #fff;
  padding-top: 0.2rem;
}
.flights_sort{
  padding:0.1rem 0.3rem 0;
  background: #fff;
}
.flights_filter{
  @include flexCenter;
  justify-content: space-between;
}
.flights_filter-select{
  font-size: 0.28rem;
  color: $lightBlack;
  font-weight:bold;
  line-height: 0.36rem;
  cursor: pointer;
}
.flights_filter-text{
  color: $green;
  font-size: 0.24rem;
  cursor: pointer;
}
.flights_filter-icon{
  margin-left:0.05rem;
  vertical-align: middle;
}
// sort
.flights_sort_type{
  @extend .flights_filter ;
  margin-top: 0.4rem;
}
.sort_type-li{
  flex:1;
  text-align: center;
}
// .sort_type-li:nth-of-type(2){
//   flex:1;
//   text-align: center;
// }
// .sort_type-li:last-child{
//   flex:1;
//   text-align: right;
// }
.sort_type-child{
  display: inline-block;
  font-size: 0.24rem;
  color:$lightBlack;
  line-height: 0.3rem;
  padding-bottom: 0.18rem;
  border-bottom:2px solid transparent;
}
.sort_type-child-active{
  color:$green;
  border-bottom:2px solid $green;
}
</style>
