<template>
<div  class="home-history" v-if="historys.length !== 0">
  <div class="home-history-title">
    <div>Search History</div>
    <!-- <i class="s-icon s-icon-history ml10"></i> -->
  </div>
  <div class="history-wrap">
    <div class="history-items">
      <div class="history-item" v-for="(val, idx) in historyList" :key="idx" @click="searchFlight(val)">
        <div class="history-item-city">
          {{val.citys}}
        </div>
        <div class="history-item-time">
          {{val.dates}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { getWDMY } from '@/utils/DateFormatUtils';
import { SET_SEARCH_FORM, SET_SEARCH_HISTORY } from '@/store/type';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      historys: (state) => state.SearchForm.searchHistory,
    }),
    historyList () {
      return this.historys.map(v => ({
        ...v,
        citys: `${v.from} - ${v.to}`,
        dates: v.tripType === 1
          ? `${getWDMY(new Date(v.departDate), true)} - ${getWDMY(new Date(v.returnDate), true)}`
          : getWDMY(new Date(v.departDate), true)
      }));
    }
  },
  methods: {
    ...mapActions([SET_SEARCH_FORM]),
    ...mapMutations([SET_SEARCH_HISTORY]),
    setHistoryForm (first) {
      const history = {
        tripType: first.tripType,
        from: {
          iata: first.from
        },
        to: {
          iata: first.to
        },
        departDate: first.departDate,
        returnDate: first.returnDate || first.departDate,
        passengers: {
          adult: first.adults,
          child: first.childs,
          infant: first.baby,
        },
        flightClass: first.cabinClass,
      };
      this.SET_SEARCH_FORM(history);
    },
    searchFlight (flightHistory) {
      const dateString = flightHistory.tripType === 0 ? `${flightHistory.departDate}` : `${flightHistory.departDate}-${flightHistory.returnDate}`;
      location.href = `/flights/${flightHistory.from}-${flightHistory.to}/${dateString}/?adults=${flightHistory.adults}&childs=${flightHistory.childs}&infants=${flightHistory.baby}&cabinClass=${flightHistory.cabinClass}`;
    },
    getHistory () {
      if (window.localStorage.getItem('searchHistory')) {
        const searchHistory = JSON.parse(window.localStorage.getItem('searchHistory'));
        // this.setHistoryForm(searchHistory[0]);
        this.SET_SEARCH_HISTORY(searchHistory.slice(0, 9));
      }
      // this.$http(searchHistory).then(res => {
      //   if (res && res instanceof Array && res.length !== 0) {
      //     const first = res[0].requestFromClient;
      //     this.setHistoryForm(first);
      //     // this.historys = res.slice(0, 9);
      //     this.SET_SEARCH_HISTORY(res.slice(0, 9));
      //   }
      // })
    }
  },
  created () {
    this.getHistory();
  }
};
</script>

<style lang="scss" scoped>
  // .home-history{
  //   // margin-bottom: 0.3rem;

  // }
  .home-history-title{
    display: flex;
    align-items: center;
    padding: 0.2rem;
    font-size: $h3;
    color: $lightBlack;
    font-weight: bold;
  }
  .history-wrap{
    width: 100%;
    overflow-x: scroll;
    &::-webkit-scrollbar{
      display: none;
    }
  }
  .history-items{
    display: flex;
    flex-wrap: nowrap;
    width: fit-content;
    padding-bottom: 0.1rem;
  }
  .history-item{
    width: 2.93rem;
    height: 1.2rem;
    padding: 0.28rem 0.2rem;
    margin-left: 0.2rem;
    background-color: #fff;
    box-shadow: 0rem 0.02rem 0.06rem 0rem rgba(174,174,174,0.5);
    border-radius:0.12rem;
    border:0.01rem solid rgba(220,220,220,1);
    &:active{
      background:#F2F2F2;
    }
  }
  .history-item-city{
    font-size: $h5;
    font-weight: bold;
    margin-bottom: 0.1rem;
  }
  .history-item-time{
    font-size: $h6;
    color: $lightBlack;
    overflow: hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
</style>
