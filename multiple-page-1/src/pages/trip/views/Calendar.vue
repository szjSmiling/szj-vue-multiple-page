<template>
  <div class="search_calendar">
    <div class="search_calendar-wrap">
      <i class="search_city-icon_closed s-icon-closed s-icon" @click="closeDateModel"></i>
      <CalendarTable :dateType="0" :selectedDate="selectedDate" :minDate="minDate" :maxDate="maxDate" @changeSelect="changeSelectDate"/>
    </div>
    <div class="mask"></div>
  </div>
</template>
<script>
import { getYearMonthDayString } from '@/utils/DateFormatUtils';
import CalendarTable from '@/components/CalendarTable';

export default {
  name: 'Calendar',
  props: ['selectedDate', 'goOrfrom'], // goOrfrom 1:depart; 2: return
  components: {
    CalendarTable
  },
  computed: {
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
    closeDateModel () {
      this.$emit('closeDateModel');
    },
    changeSelectDate (nextDate) {
      nextDate = getYearMonthDayString(nextDate);
      this.$emit('changeDate', { date: nextDate, type: this.goOrfrom });
    }
  }
};
</script>
<style lang="scss" scoped>
.mask{
  top: $headerH;
}
.search_calendar{
  position: fixed;
  top: $headerH;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 20;
  background-color: rgba($color: #000000, $alpha: .7);
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
