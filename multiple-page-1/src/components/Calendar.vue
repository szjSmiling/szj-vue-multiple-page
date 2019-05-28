<template>
  <div class="search_calendar" @click.self="$router.go(-1)">
    <div class="search_calendar-wrap">
      <i class="search_city-icon_closed s-icon-closed s-icon" @click="$router.go(-1)"></i>
      <CalendarTable :dateType="dateType" :selectedDate="dateType === 0 ? departDate : returnDate" :minDate="minDate" :maxDate="maxDate" @changeSelect="changeSelectDate"/>
    </div>
  </div>
</template>
<script>
// import { searchAirPortCity } from '@/constants/ApiConstants';
import { mapState, mapMutations } from 'vuex';
import { SET_DATE } from '@/store/type';
import { getLowPriceCalendar } from '@/constants/ApiConstants';
import CalendarTable from './CalendarTable';
import { getYearMonthDayString } from '@/utils/DateFormatUtils';
import { addBodyOverHidden, removeBodyOverHidden } from '@/utils/DomUtils';

export default {
  name: 'Calendar',
  components: {
    CalendarTable
  },
  data () {
    return {

    };
  },
  computed: {
    ...mapState({
      selectedCitys: (state) => state.SearchForm.selectedCitys,
      dateType: (state) => state.SearchForm.dateType,
      departDate: (state) => state.SearchForm.departDate,
      returnDate: (state) => state.SearchForm.returnDate
    }),
    minDate () {
      // 设置回程的最小日期 按出发的日期
      // if (this.dateType === 1) {
      //   const maxDate = Math.max(new Date().getTime(), this.departDate.getTime());
      //   return new Date(maxDate);
      // }
      return new Date();
    },
    maxDate () {
      return new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
    }
  },
  methods: {
    ...mapMutations([
      SET_DATE,
    ]),

    getLowPrices () {
      const data = {
        from: this.selectedCitys[0].iata,
        to: this.selectedCitys[1].iata
      };
      this.$http.post(getLowPriceCalendar, data).then(res => {
        if (res.success) {
          return res.data;
        }
      });
    },
    getLowestPrice (monthOfPrices) {
    },
    changeSelectDate (nextDate) {
      this.SET_DATE({ date: getYearMonthDayString(nextDate) });
      this.$router.go(-1);
    }
  },
  created () {
    addBodyOverHidden();
  },
  beforeDestroy () {
    removeBodyOverHidden();
  }
};
</script>
<style lang="scss" scoped>
.search_calendar{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 20;

}
.search_calendar-wrap{
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 0.3rem;
  border-radius: .16rem;
  background-color: #fff;
  margin-top: 1.37rem;
  z-index: 30;
}
.search_city-icon_closed{
  position: absolute;
  left: 50%;
  top: -0.7rem;
  transform: translateX(-50%);
}
.search_city-inputs{
  position: relative;
  width: 6.6rem;
  margin: 0 auto;
}
.search_city-input{
  width: 6.6rem;
  height: 0.68rem;
  padding: 0 0.2rem;
  font-weight: bold;
  font-size: 0.28rem;
  border-radius: 0.12rem;
  background-color: #eaeaea;
  &:active{
    border-color: $green;
  }
}
.search_city-icon_close{
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
}
.search_city-lists{
  padding: 0 0.3rem;
}
.search_city-list{
  width: 100%;
  height: 0.78rem;
  line-height: 0.78rem;
  color: $lighterBlack;
  padding-left: 0.2rem;
  border-bottom: 1px solid  #dcdcdc;
}

</style>
