<template>
  <div class="flights_header" @click="showSearchModel">
    <div class="flights_header-left noselect">
      <h3 class="flights_header-city">{{departCity}} - {{returnCity}}</h3>
      <p class="flights_header-time">{{`${departDate}${tripType===1 ? ` / ${returnDate}`: ''}`}}</p>
    </div>
    <i class="s-icon s-icon-search"></i>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { getWDMY } from '@/utils/DateFormatUtils';

export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapState({
      showWhichFlights: (state) => state.FlightInfo.showWhichFlights,
      departDate: (state) => getWDMY(new Date(state.SearchForm.departDate), true),
      returnDate: (state) => getWDMY(new Date(state.SearchForm.returnDate), true),
      tripType: (state) => state.SearchForm.tripType,
      selectedCitys: (state) => state.SearchForm.selectedCitys,
    }),
    ...mapGetters(['suitableFlightsList']),
    departCity () {
      return this.selectedCitys[0].city || this.selectedCitys[0].iata
    },
    returnCity () {
      return this.selectedCitys[1].city || this.selectedCitys[1].iata
    }
  },
  methods: {
    showSearchModel () {
      this.$emit('searchModel');
    }
  }
};
</script>
<style lang="scss" scoped>
.flights_header{
  position: sticky;
  top: 0;
  left:0;
  background: $green;
  z-index: 12;
  padding:0 0.3rem;
  height:1.2rem;
  line-height:1.2rem;
  @include flexCenter;
  justify-content: space-between;
  .flights_header-city{
    color: #fff;
    font-size: 0.38rem;
    line-height:0.48rem;
  }
  .flights_header-time{
    color: #fff;
    font-size: 0.22rem;
    line-height:0.3rem;
  }
  .s-icon{
    cursor: pointer;
  }
}
</style>
