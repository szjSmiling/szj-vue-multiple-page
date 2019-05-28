<template>
  <div class="flights">
    <transition enter-active-class="topEnter" leave-active-class="topLeave">
      <router-view name="searchForm"></router-view>
      <!-- <SearchForm v-if="showSearchModel" @closeSearchModel="closeSearchModel" @searchFlight="getSearchFlightsList"/> -->
    </transition>
    <transition enter-active-class="opacityEnter" leave-active-class="opacityLeave">
      <ConfirmModal v-if="showConfirmModal" :errorMsg="errorMsg" :btnText="btnText" :btnBgStyle="btnBgStyle"/>
    </transition>

    <!-- filter Router-view -->
    <transition enter-active-class="opacityEnter" leave-active-class="opacityLeave">
      <!-- <keep-alive> -->
        <router-view></router-view>
      <!-- </keep-alive> -->

    </transition>

    <div class="flight_content">

      <FlightsHeader @searchModel="searchModel" />

      <div class="content_cont">
        <FlightsSort class="cont_depart" />
        <FlightsList v-if="showFlightList"
        :advImagelist="advImagelist" @showSearchForm="showSearchForm" />
        <FlightsEmpty v-if="flightsEmpty && !isFetchingFlight" @showSearchForm="showSearchForm"/>
      </div>
      <Foot />
    </div>

    <div class="mask" v-if="isSearchModel"></div>
  </div>
</template>
<script>
import { hasItem, getItem } from '@/utils/CookieUtils';
import FlightsHeader from './FlightsHeader.vue';
import FlightsSort from './FlightsSort.vue';
import FlightsList from './FlightsList.vue';
import EventHub from '@/utils/EventHub';
import { ScrollToPageTop } from '@/utils/ScrollToPageTop';
import { getAdvertising } from '@/constants/ApiConstants';
import { getYearMonthDayString } from '@/utils/DateFormatUtils';
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex';
import { Indicator } from 'mint-ui';
import {
  SAVE_FLIGHTINFO,
  RESET_FILTER_OPTIONS,
  SET_SEARCH_FORM,
  CHANGE_WHICH_FLIGHTS,
  GET_FLIGHTS_LIST
} from '@/store/type';

export default {
  name: 'flights',
  components: {
    FlightsHeader,
    FlightsSort,
    FlightsList,
    FlightsEmpty: () => import('./FlightsEmpty'),
    // SearchForm: () => import('./SearchForm'),
    ConfirmModal: () => import('@/components/confirmModal'),
    // FlightsFilter,
    Foot: () => import('@/components/Foot.vue'),
  },
  data () {
    return {
      errorMsg: 'If you modify search, you have to re-select your going flight',
      btnText: 'Modify',
      btnBgStyle: true,
      advImagelist: [],
      showConfirmModal: false,
    };
  },
  computed: {
    ...mapState({
      flightsEmpty: state => !state.FlightInfo.flightsData.success,
      // cityType: 0, // 出发地， 目的地
      // dateType: 0, //  去程 时间，回程时间
      tripType: (state) => state.SearchForm.tripType,
      selectedCitys: (state) => state.SearchForm.selectedCitys,
      departDate: (state) => state.SearchForm.departDate,
      returnDate: (state) => state.SearchForm.returnDate,
      passengers: (state) => state.SearchForm.passengers,
      flightClass: (state) => state.SearchForm.flightClass,
      showWhichFlights: state => state.FlightInfo.showWhichFlights,
      isFetchingFlight: state => state.FlightInfo.isFetchingFlight,
    }),
    ...mapGetters([
      'sortFlightsList'
    ]),
    isSearchModel () {
      return this.$route.meta.isMask;
    },
    flightsDataList () {
      return this.$store.getters.flightsDataList || [];
    },
    showFlightList () {
      return this.flightsDataList.length !== 0 && !this.flightsEmpty;
    },
  },
  created () {
    EventHub.$on('isShowModel', (flag) => {
      this.showConfirmModal = false;
      flag && this.showSearchForm();
    });

    const searchForm = this.urlToSearchParmas(this.$route);
    this.SET_SEARCH_FORM(searchForm).then(() => {
      this.GET_FLIGHTS_LIST();
    })
    this.getAdvImages();
  },
  methods: {
    ...mapMutations([SAVE_FLIGHTINFO]),
    ...mapActions([RESET_FILTER_OPTIONS, SET_SEARCH_FORM, GET_FLIGHTS_LIST, CHANGE_WHICH_FLIGHTS]),

    searchModel () {
      ScrollToPageTop('flights');
      if (this.showWhichFlights === 1) {
        this.showConfirmModal = true;
      } else {
        this.showSearchForm();
      }
    },
    showSearchForm () {
      this.$router.push({ path: `/flights/${this.$route.params.citys}/${this.$route.params.date}/search-form`, query: this.$route.query });
    },
    getAdvImages () {
      const url = `${getAdvertising}?type=12&device=0&businessType=1&platform=${hasItem('platform') ? getItem('platform') : '065626cf-a5a9-4ae8-ba71-ed5f4b8b748d'}`;

      this.$http(url, {
        headers: {
          'x-Device': 'mobile'
        }
      }).then(res => {
        if (res.success && res.list instanceof Array && res.list.length > 0) {
          this.advImagelist = res.list;
        }
      })
    },
    urlToSearchParmas (to) {
      const reg = /(20\d{2}-\d{2}-\d{2})(-(20\d{2}-\d{2}-\d{2}))?/g;
      const dateArray = reg.exec(to.params.date) || [];
      const departDate = dateArray[1] || getYearMonthDayString(new Date());
      const returnDate = dateArray[3] || departDate;
      const cityArray = to.params.citys.split('-');
      return {
        tripType: dateArray[3] ? 1 : 0,
        from: {
          iata: cityArray[0] || 'DEL'
        },
        to: {
          iata: cityArray[1] || 'BOM'
        },
        departDate,
        returnDate,
        passengers: {
          adult: parseInt(to.query.adults) || 1,
          child: parseInt(to.query.childs) || 0,
          infant: parseInt(to.query.infants) || 0
        },
        flightClass: to.query.cabinClass || 'Economy'
      }
    },
    diffSearchParams (next) {
      return !(next.tripType === this.tripType &&
        next.from.iata.toUpperCase() === this.selectedCitys[0].iata &&
        next.to.iata.toUpperCase() === this.selectedCitys[1].iata &&
        next.departDate === this.departDate &&
        next.returnDate === this.returnDate &&
        next.passengers.adult === this.passengers.adult &&
        next.passengers.child === this.passengers.child &&
        next.passengers.infant === this.passengers.infant &&
        next.flightClass === this.flightClass
      )
    }
  },
  beforeRouteLeave (to, from, next) {
    this.CHANGE_WHICH_FLIGHTS(0);
    next();
  },
  watch: {
    $route (to, from) {
      // 根据路由名称判断是否需要走 这里
      if (to.name !== 'confirm') {
      // 如果在 选择往返中切换
        if ((!to.query.return) !== (!from.query.return)) {
          if (to.query.return) {
            this.CHANGE_WHICH_FLIGHTS(1);
            Indicator.open({
              spinnerType: 'fading-circle',
            });
            setTimeout(() => {
              Indicator.close();
              document.querySelector('.content_cont').scrollTop = 0
            }, 600);
          } else {
            this.CHANGE_WHICH_FLIGHTS(0);
          }
        }
        // if (to.fullPath.replace(/#\w*/, '') !== from.fullPath.replace(/#\w*/, '')) {
        //   const searchForm = this.urlToSearchParmas(to);
        //   // 如果参数不同请求
        //   if (this.diffSearchParams(searchForm)) {
        //     // this.SET_SEARCH_FORM(searchForm).then(res => {
        //     this.GET_FLIGHTS_LIST();
        //     // })
        //   }
        // }
        if (to.params.citys !== from.params.citys ||
      to.params.date !== from.params.date ||
      to.query.adults !== from.query.adults ||
      to.query.childs !== from.query.childs ||
      to.query.infants !== from.query.infants
        ) {
          const searchForm = this.urlToSearchParmas(to);
          this.SET_SEARCH_FORM(searchForm).then(res => {
            this.GET_FLIGHTS_LIST();
          })
        }
      }
    }
  },
  beforeDestroy () {
    EventHub.$off('isShowModel');
  },
};
</script>
<style lang="scss" scoped>
.flights{
  position: relative;
  height:100%;
  overflow: hidden;
}
.flight_content{
  height:100%;
  overflow: hidden;
  background: #f1f1f1;
}
.content_cont{
  position: relative;
  height:100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  background: #f1f1f1;
}
.cont_depart{
  background:#fff;
  padding-top: 0.2rem;
}
.home-logo{
  position: absolute;
  bottom: 0;
  left: 0;
}
.flight_list3{
  position: fixed;
  bottom: 0;
  left: 0;
}

.insure-slide-enter-active {
  animation: bounce-in .5s ease-out;
}
.insure-slide-leave-active {
  animation: bounce-in .5s ease-out reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateX(500px);
  }
  100% {
    transform: translateX(0px);
  }
}
.search_form{
  z-index: 15!important;
}
</style>
